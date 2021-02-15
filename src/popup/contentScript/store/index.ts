import { fromEvent, Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { onUnmounted } from 'vue';
import {nanoid} from "nanoid";

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
  let originToSource: Record<string, Window> = {};
  const connectionObservable = fromEvent<MessageEvent>(window.top, 'message').pipe(
    filter<MessageEvent, MessageEventFromContentScript<string>>((e): e is MessageEventFromContentScript<string> => e.data.plusSubActionFromContentScript)
  );
  const connectionSubject = new Subject<ConnectionEvent>();
  const messageObservable = new Subject<any>();

  const messageBridgeSubscription = connectionObservable
    .pipe(filter((e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript !== 'REGISTER_ME_REQUEST_FROM_IFRAME'))
    .subscribe((e) => messageObservable.next(e));

  const registerSubscription = connectionObservable
    .pipe(
      filter<MessageEventFromContentScript<string>, MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'>>(
        (e): e is MessageEventFromContentScript<'REGISTER_ME_REQUEST_FROM_IFRAME'> => e.data.plusSubActionFromContentScript === 'REGISTER_ME_REQUEST_FROM_IFRAME'
      )
    )
    .subscribe((e) => {
      originToSource[e.origin] = e.source as Window;
      (e.source as Window).postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*');
      connectionSubject.next({ action: 'ADD', origin: e.origin });
    });

  onUnmounted(() => {
    Object.entries(originToSource).forEach(([origin, source]) => {
      source.postMessage({ plusSubActionFromPopup: 'UNMOUNT' }, '*');
      connectionSubject.next({ action: 'REMOVE', origin });
    });
    messageBridgeSubscription.unsubscribe();
    originToSource = {};
    registerSubscription.unsubscribe();
  });

  return {
    state: {
      messageObservable: messageObservable,
      connectionObservable: connectionSubject
    },
    actions: {
      requestAllContentScriptsToRegister: () => {
        console.warn('request all content scripts');
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

      sendCommand: (origin: string, payload: Record<string, unknown>) => {
        const source = originToSource[origin];
        if (!source) {
          console.warn(`source for origin ${ origin } not found`);
          console.warn(payload);
          console.warn(originToSource);
          return;
        }
        source.postMessage(payload, '*');
      }
    }
  };
};
