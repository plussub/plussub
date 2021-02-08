import { fromEvent, Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {onUnmounted} from "vue";

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

export const init = (): ContentScriptStore => {
  let originToSource: Record<string, Window> = {};
  const connectionObservable = fromEvent<MessageEvent>(window.top, 'message').pipe(filter((k) => k.data.plusSubActionFromContentScript));
  const connectionSubject = new Subject<ConnectionEvent>();
  const messageObservable = new Subject<any>();

  const messageBridgeSubscription = connectionObservable.pipe(filter((e) => e.data.plusSubActionFromContentScript !== 'REGISTER_ME_REQUEST_FROM_IFRAME')).subscribe((e) => messageObservable.next(e));

  const registerSubscription = connectionObservable
    .pipe<MessageEvent<{ plusSubActionFromContentScript: string; }>>(filter((e) => e.data.plusSubActionFromContentScript === 'REGISTER_ME_REQUEST_FROM_IFRAME'))
    .subscribe((e) => {
      originToSource[e.origin] = e.source as Window;
      console.warn('popup: register me from iframe');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      e.source.postMessage({ plusSubActionFromPopup: 'REGISTER_ACK' }, '*');
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
  })

  return {
    state: {
      messageObservable: messageObservable,
      connectionObservable: connectionSubject
    },
    actions: {
      requestAllContentScriptsToRegister: () => [...document.querySelectorAll('iframe'), {contentWindow: window}].map((w) => w.contentWindow?.postMessage({ plusSubActionFromPopup: 'REQUEST_FOR_REGISTER' }, '*')),

      sendCommand: (origin: string, payload: Record<string, unknown>) => {
        const source = originToSource[origin];
        if (!source) {
          console.warn(`source for origin ${{ origin }} not found`);
          return;
        }
        source.postMessage(payload, '*');
      }
    }
  };
};
