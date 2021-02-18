import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import { nanoid } from 'nanoid';

export interface ContentScriptStore {
  state: {
    connectionObservable: Observable<any>;
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
  const messageObservable = fromEvent<MessageEvent>(window.top, 'message').pipe(
    filter<MessageEvent, MessageEventFromContentScript<string>>((e): e is MessageEventFromContentScript<string> => e.data.plusSubActionFromContentScript),
    share()
  );

  type ConnectionEvent =
    | {
        action: 'ADD';
        origin: string;
        source: Window;
      }
    | {
        action: 'REMOVE';
        origin: string;
      };

  const connectionSubject = new Subject<ConnectionEvent>();
  // use map, failed to solve with stream. maybe revist it later
  const connectionMap = new Map<string, { source: Window; origin: string }>();

  const registerMeRequestFromIFrameFromContentScript = messageObservable.pipe(
    filter<MessageEventFromContentScript<string>, MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'>>(
      (e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript === 'REGISTER_ME_REQUEST_FROM_IFRAME'
    ),
    map(({ origin, source }) => ({
      origin,
      source: source as Window
    })),
    tap(({ origin, source }) => source.postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*')),
    tap(({ origin, source }) => connectionMap.set(origin, { source, origin })),
    tap(({ origin, source }) => connectionSubject.next({ action: 'ADD', origin, source }))
  );

  //
  const sendSubject = new Subject<{ origin: string; payload: Record<string, unknown> }>();
  const sendObservable = sendSubject.pipe(
    tap(({ origin, payload }) => {
      // console.warn('send to origin' + origin + ' command: ' + payload.plusSubActionFromPopup);
      const connection = connectionMap.get(origin);
      if (connection) {
        connection.source.postMessage(payload, '*');
      } else {
        console.warn('connection not set, race condition ?');
        console.warn(connectionMap);
      }
    })
  );
  const unmountSubject = new Subject<boolean>();
  const unmountObservable = unmountSubject.pipe(
    tap((e) => {
      [...connectionMap.values()].forEach(({ source }) => {
        source.postMessage({ plusSubActionFromPopup: 'UNMOUNT' }, '*');
      });
      connectionMap.clear();
    })
  );

  const subscription = merge(messageObservable, registerMeRequestFromIFrameFromContentScript, sendObservable, unmountObservable).subscribe();

  onUnmounted(() => {
    unmountSubject.next(true);
    subscription.unsubscribe();
  });

  return {
    state: {
      messageObservable,
      connectionObservable: connectionSubject.asObservable()
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
