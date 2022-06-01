import { combineLatest, debounceTime, fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, map, scan, share, take, takeUntil, tap, bufferCount } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import { nanoid } from 'nanoid';
import { EXTENSION_ORIGIN } from '@/types';

export const isGenericContentScriptOutputMessageEvent = <T extends string, P extends Record<string, unknown> > (m: MessageEvent): m is ContentScriptOutputMessageEvent<T, P> => {
  return m.data.extensionOrigin === EXTENSION_ORIGIN && typeof m.data.contentScriptOutput === 'string' && typeof m.data.id === 'string';
}

export interface ContentScriptOutputMessageEvent<T extends string, P extends Record<string, unknown>> extends MessageEvent<{ contentScriptOutput: T, id: string } & P> {
  data: {
    extensionOrigin: typeof EXTENSION_ORIGIN,
    contentScriptOutput: T;
    id: string;
  } & P;
}

export type GenericContentScriptOutputMessageEvent = ContentScriptOutputMessageEvent<string, Record<string, unknown>>;


export interface ContentScriptStore {
  actions: {
    requestAllContentScriptsToRegister: () => void;
    sendCommand: (payload: {contentScriptInput: string} & Record<string, unknown>) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendCommandWithResponse: (payload: {contentScriptInput: string} & Record<string, unknown>, mergeFn: (x: any[]) => any) => Observable<any>;
  };
}


const setObject = (object, key, value) => ({
  ...object,
  [key]: value,
});


export const init = (): ContentScriptStore => {
  if(!window.top){
    throw new Error('no window.top');
  }
  const inputObservable = fromEvent<MessageEvent>(window.top, 'message').pipe(
    filter<MessageEvent, GenericContentScriptOutputMessageEvent>(isGenericContentScriptOutputMessageEvent),
    share()
  );

  type ConnectionEvent =
    | {
        action: 'ADD';
        origin: string;
        source: Window;
        id: string;
      }
    | {
        action: 'REMOVE';
        origin: string;
      };

  const connectionSubject = new Subject<ConnectionEvent>();
  const connectionObservable = connectionSubject.pipe(
    scan<ConnectionEvent, Record<string, { source: Window; origin: string; id: string }>>((acc, command) => {
      if (command.action === 'ADD') {
        return setObject(acc, command.id, {
          source: command.source,
          origin: command.origin,
          id: command.id
        });
      }
      return { ...Object.fromEntries(Object.entries(acc).filter(([origin]) => origin !== command.origin)) };
    }, {})
  );

  const contentScriptLoadedObservable = inputObservable.pipe(
    filter((e): e is ContentScriptOutputMessageEvent<'CONTENT_SCRIPT_LOADED', Record<string, unknown>> => e.data.contentScriptOutput === 'CONTENT_SCRIPT_LOADED'),
    tap(({ origin, source, data: { id } }) => connectionSubject.next({ action: 'ADD', origin, source: source as Window, id }))
  );


  const sendAllSubject = new Subject<{ payload: Record<string, unknown>}>();
  const sendAllObservable = combineLatest([sendAllSubject, connectionObservable]).pipe(
    debounceTime(0),
    tap(([{ payload }, connections]) =>
      Object.values(connections).forEach(({ source }) =>
        source.postMessage(
          {
            ...payload,
            requestId: nanoid(5),
            extensionOrigin: EXTENSION_ORIGIN
          },
          '*'
        )
      )
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendWithResponseSubject = new Subject<{ payload: Record<string, unknown>, mergeFn: (x: any[]) => any, responseSubject: Subject<any>}>();
  const sendWithResponseObservable = combineLatest([sendWithResponseSubject, connectionObservable]).pipe(
    debounceTime(0),
    tap(([{ payload, mergeFn,  responseSubject }, connections]) => {
      const con = Object.values(connections);
      const requestIds = con.map(() => nanoid(5));
      const requestIdsSet = new Set(requestIds);
      inputObservable
        .pipe(
          filter((e) => requestIdsSet.has(e.data.requestId as string)),
          take(con.length),
          bufferCount(con.length, con.length),
          map((e) => mergeFn(e)),
          tap((e) => responseSubject.next(e))
        )
        .subscribe();

      con.forEach(({ source }, idx) => source.postMessage({ ...payload, requestId: requestIds[idx], extensionOrigin: EXTENSION_ORIGIN }, '*'));
    })
  );

  const unmountSubject = new Subject<undefined>();

  merge(
    inputObservable,
    contentScriptLoadedObservable,
    connectionObservable,
    sendAllObservable,
    sendWithResponseObservable,
    unmountSubject
  ).pipe(takeUntil(unmountSubject)).subscribe()

  onUnmounted(() => unmountSubject.next(undefined));

  return {
    actions: {
      requestAllContentScriptsToRegister: () => {
        [...document.querySelectorAll('iframe'), { contentWindow: window }]
          .map(({ contentWindow }) => ({
            contentWindow: contentWindow as Window,
            requestId: nanoid(5)
          }))
          .filter((e) => e.contentWindow)
          .forEach(({ contentWindow, requestId }) => {
            inputObservable
              .pipe(
                filter((e): e is ContentScriptOutputMessageEvent<'PING_RESPONSE', { requestId: string }> => e.data.contentScriptOutput === 'PING_RESPONSE' && e.data.requestId === requestId),
                take(1),
                tap(({ origin, source, data: { id } }) => connectionSubject.next({ action: 'ADD', origin, source: source as Window, id }))
              )
              .subscribe();
            contentWindow.postMessage({ contentScriptInput: 'PING_REQUEST', requestId, extensionOrigin: EXTENSION_ORIGIN }, '*');
          });
      },

      sendCommand: (payload: Record<string, unknown>) => sendAllSubject.next({ payload }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendCommandWithResponse: (payload: Record<string, unknown>, mergeFn: (x: any[]) => any): Observable<any> => {
        const responseSubject = new Subject();
        sendWithResponseSubject.next({ payload, mergeFn, responseSubject });
        return responseSubject.asObservable();
      }
    }
  };
};
