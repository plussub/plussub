import { combineLatest, from, fromEvent, merge, Observable, Subject } from 'rxjs';
import { distinct, filter, map, mergeMap, scan, share, shareReplay, tap } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import { nanoid } from 'nanoid';

interface ConnectionEvent {
  action: 'ADD' | 'REMOVE';
  origin: string;
}

export interface ContentScriptStore {
  state: {
    connectionObservable: Observable<ConnectionEvent>;
    messageObservable: Observable<any>;
  };
  actions: {
    requestAllContentScriptsToRegister: () => void;
    sendCommand: (origin: string, payload: Record<string, unknown>) => void;
  };
}

export interface MessageEventFromContentScript<T extends string> extends MessageEvent<{ plusSubActionFromContentScript: T }> {
  data: {
    plusSubActionFromContentScript: T;
    [k: string]: unknown;
  };
}

export const init = (): ContentScriptStore => {
  const connectionObservable = fromEvent<MessageEvent>(window.top, 'message').pipe(
    filter<MessageEvent, MessageEventFromContentScript<string>>((e): e is MessageEventFromContentScript<string> => e.data.plusSubActionFromContentScript)
  );
  const connectionSubject = new Subject<ConnectionEvent>();
  const unmountSubject = new Subject<boolean>();
  const sendSubject = new Subject<{ origin: string; payload: Record<string, unknown> }>();
  const messageObservable = new Subject<any>();

  const messageBridgeObservable = connectionObservable.pipe(
    share(),
    filter((e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript !== 'REGISTER_ME_REQUEST_FROM_IFRAME'),
    tap((e) => messageObservable.next(e))
  );

  const registerObservable = connectionObservable.pipe(
    share(),
    filter<MessageEventFromContentScript<string>, MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'>>(
      (e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript === 'REGISTER_ME_REQUEST_FROM_IFRAME'
    ),
    map(({ origin, source }) => {
      return {
        [origin]: {
          source: source as Window,
          origin
        }
      };
    }),
    scan((acc, cur) => ({ ...acc, ...cur }))
    // tap((e) => e.source.postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*')),
    // tap((e) => connectionSubject.next({ action: 'ADD', origin: e.origin }))
  );

  const sendRegisterAckObservable = registerObservable.pipe(
    shareReplay(1),
    mergeMap((e) => from(Object.values(e))),
    distinct((e) => e.origin),
    tap((e) => e.source.postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*')),
    tap((e) => connectionSubject.next({ action: 'ADD', origin: e.origin }))
  );

  const unmountObservable = combineLatest([unmountSubject, registerObservable]).pipe(
    shareReplay(1),
    mergeMap(([, e]) => from(Object.values(e))),
    tap((e) => {
      e.source.postMessage({ plusSubActionFromPopup: 'UNMOUNT' }, '*');
      connectionSubject.next({ action: 'REMOVE', origin: e.origin });
    })
  );

  const sendObservable = combineLatest([sendSubject, registerObservable.pipe(shareReplay(1))]).pipe(
    map(([send, register]) => {
      const val = Object.values(register).find((reg) => reg.origin === send.origin);
      return val ? { source: val.source, ...send } : undefined;
    }),
    filter((e): e is { source: Window; payload: Record<string, unknown>; origin: string } => e !== undefined),
    tap(({ source, payload }) => source.postMessage(payload, '*'))
  );

  const subscription = merge(messageBridgeObservable, registerObservable, sendRegisterAckObservable, unmountObservable, sendObservable).subscribe();

  onUnmounted(() => {
    unmountSubject.next(true);
    subscription.unsubscribe();
  });

  return {
    state: {
      messageObservable: messageObservable,
      connectionObservable: connectionSubject
    },
    actions: {
      requestAllContentScriptsToRegister: () => {
        [...document.querySelectorAll('iframe'), { contentWindow: window }].map((w) =>
          w.contentWindow?.postMessage(
            {
              plusSubActionFromPopup: 'REQUEST_FOR_REGISTER',
              id: nanoid(12)
            },
            '*'
          )
        );
      },

      sendCommand: (origin: string, payload: Record<string, unknown>) =>
        sendSubject.next({
          origin,
          payload
        })
    }
  };
};
