import { combineLatest, fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, map, scan, share, take, takeUntil, tap } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import { nanoid } from 'nanoid';

export interface ContentScriptStore {
  state: {
    connectionObservable: Observable<Record<string, { source: Window; origin: string }>>;
    messageObservable: Observable<MessageEventFromContentScript<string>>;
  };
  actions: {
    requestAllContentScriptsToRegister: () => void;
    sendCommand: (origin: string, payload: Record<string, unknown>) => void;
    sendCommandAll: (payload: Record<string, unknown>) => void;
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
  const connectionObservable = connectionSubject.pipe(
    scan<ConnectionEvent, Record<string, { source: Window; origin: string }>>(
      (acc, command) =>
        command.action === 'ADD'
          ? {
              ...acc,
              [command.origin]: {
                source: command.source,
                origin: command.origin
              }
            }
          : {
              ...Object.fromEntries(Object.entries(acc).filter(([origin]) => origin !== command.origin))
            },
      {}
    )
  );

  const registerMeRequestFromIFrameFromContentScript = messageObservable.pipe(
    filter<MessageEventFromContentScript<string>, MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'>>(
      (e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript === 'REGISTER_ME_REQUEST_FROM_IFRAME'
    ),
    map(({ origin, source }) => ({
      origin,
      source: source as Window
    })),
    tap(({ origin, source }) => source.postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*')),
    tap(({ origin, source }) => connectionSubject.next({ action: 'ADD', origin, source }))
  );

  //
  const sendSubject = new Subject<{ origin: string; payload: Record<string, unknown> }>();
  const sendObservable = combineLatest([sendSubject, connectionObservable]).pipe(
    tap(([{ origin, payload }, connections]) => {
      if (connections[origin]) {
        connections[origin].source.postMessage(payload, '*');
      } else {
        console.warn('connection not found, race condition ?');
        console.warn(connections);
      }
    })
  );

  const sendAllSubject = new Subject<{ payload: Record<string, unknown> }>();
  const sendAllObservable = combineLatest([sendAllSubject, connectionObservable]).pipe(
    tap(([{ payload }, connections]) => Object.values(connections).forEach(({ source }) => source.postMessage(payload, '*')))
  );

  const unmountSubject = new Subject<undefined>();

  const connectionCleanUpObservable = combineLatest([connectionObservable, unmountSubject]).pipe(
    tap(([connections]) => Object.values(connections).forEach(({ source }) => source.postMessage({ plusSubActionFromPopup: 'UNMOUNT' }, '*'))),
    take(1)
  );

  merge(messageObservable, registerMeRequestFromIFrameFromContentScript, sendObservable, connectionObservable, connectionCleanUpObservable, sendAllObservable)
    .pipe(takeUntil(connectionCleanUpObservable))
    .subscribe();

  onUnmounted(() => unmountSubject.next(undefined));

  return {
    state: {
      messageObservable,
      connectionObservable: connectionObservable
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
        }),

      sendCommandAll: (payload: Record<string, unknown>) => sendAllSubject.next({payload})
    }
  };
};
