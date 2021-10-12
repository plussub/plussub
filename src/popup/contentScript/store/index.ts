import { combineLatest, debounceTime, fromEvent, merge, mergeMap, Observable, Subject } from 'rxjs';
import { filter, map, scan, share, take, takeUntil, tap, bufferCount } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import { nanoid } from 'nanoid';

export interface ContentScriptOutputMessageEvent<T extends string> extends MessageEvent<{ plusSubContentScriptOutput: T, id: string }> {
  data: {
    plusSubContentScriptOutput: T;
    id: string;
    [k: string]: unknown;
  };
}

export interface ContentScriptStore {
  actions: {
    requestAllContentScriptsToRegister: () => void;
    sendCommand: (payload: Record<string, unknown>) => void;
    sendCommandWithResponse: (payload: Record<string, unknown>, mergeFn: (x: any[]) => any) => Observable<any>;
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
    filter<MessageEvent, ContentScriptOutputMessageEvent<string>>((e): e is ContentScriptOutputMessageEvent<string> => e.data.plusSubContentScriptOutput),
    share()
  );

  type ConnectionEvent =
    | {
        action: 'ADD';
        origin: string;
        source: any;
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
    filter((e): e is ContentScriptOutputMessageEvent<'CONTENT_SCRIPT_LOADED'> => e.data.plusSubContentScriptOutput === 'CONTENT_SCRIPT_LOADED'),
    tap(({ origin, source, data: { id } }) => connectionSubject.next({ action: 'ADD', origin, source, id }))
  );


  const sendAllSubject = new Subject<{ payload: Record<string, unknown>}>();
  const sendAllObservable = combineLatest([sendAllSubject, connectionObservable]).pipe(
    debounceTime(0),
    tap(([{ payload }, connections]) =>
      Object.values(connections).forEach(({ source }) =>
        source.postMessage(
          {
            ...payload,
            requestId: nanoid(5)
          },
          '*'
        )
      )
    )
  );

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

      con.forEach(({ source }, idx) => source.postMessage({ ...payload, requestId: requestIds[idx] }, '*'));
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
                filter((e): e is ContentScriptOutputMessageEvent<'PING_RESPONSE'> => e.data.plusSubContentScriptOutput === 'PING_RESPONSE' && e.data.requestId === requestId),
                take(1),
                tap(({ origin, source, data: { id } }) => connectionSubject.next({ action: 'ADD', origin, source, id }))
              )
              .subscribe();
            contentWindow!.postMessage({ plusSubContentScriptInput: 'PING_REQUEST', requestId }, '*');
          });
      },

      sendCommand: (payload: Record<string, unknown>) => sendAllSubject.next({ payload }),
      sendCommandWithResponse: (payload: Record<string, unknown>, mergeFn: (x: any[]) => any): Observable<any> => {
        const responseSubject = new Subject();
        sendWithResponseSubject.next({ payload, mergeFn, responseSubject });
        return responseSubject.asObservable();
      }
    }
  };
};
