import { combineLatest, fromEvent, Subject, merge } from 'rxjs';
import { distinct, filter, share, startWith, tap } from 'rxjs/operators';
import { postMessage } from './postMessage';
import { init as initHighlight } from './highlight';
import { init as initVideo } from './video';
import { init as initSubtitle } from './subtitle';
import { init as initTime } from './time';
import { MessageEventFromPopup } from './types';
import {Ref} from "vue";

declare global {
  interface Window {
    plussub_contentscript: boolean;
  }
}


(async () => {
  if(window.plussub_contentscript){
    return;
  }
  window.plussub_contentscript = true;
  const connectionSubject = new Subject<boolean>();
  const connectionObservable = connectionSubject.pipe(startWith(false));

  const messageObservable = fromEvent<MessageEvent>(window.self, 'message').pipe(
    filter<MessageEvent, MessageEventFromPopup<string>>((e): e is MessageEventFromPopup<string> => typeof e.data.plusSubActionFromPopup === 'string'),
    tap((e) => console.warn(e.data)),
    share()
  );

  type RequestForRegisterMessageEvent = MessageEventFromPopup<'REQUEST_FOR_REGISTER'> & { data: { id: string } };
  const requestForRegisterMeFromPopupObservable = combineLatest([
    connectionObservable,
    messageObservable.pipe(filter<MessageEventFromPopup<string>, RequestForRegisterMessageEvent>((e): e is RequestForRegisterMessageEvent => e.data.plusSubActionFromPopup === 'REQUEST_FOR_REGISTER'))
  ]).pipe(
    filter(([connected]) => !connected),
    distinct(([, x]) => x.data.id),
    tap(() => postMessage({ plusSubActionFromContentScript: 'REGISTER_ME_REQUEST_FROM_IFRAME' }))
  );

  const registerAckFromPopupObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, MessageEventFromPopup<'REGISTER_ACK'>>((e): e is MessageEventFromPopup<'REGISTER_ACK'> => e.data.plusSubActionFromPopup === 'REGISTER_ACK'),
    tap(() => connectionSubject.next(true))
  );

  const unmountFromPopupObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, MessageEventFromPopup<'UNMOUNT'>>((e): e is MessageEventFromPopup<'UNMOUNT'> => e.data.plusSubActionFromPopup === 'UNMOUNT'),
    tap(() => connectionSubject.next(false))
  );

  const getElementFrom = (id: string) => document.querySelector<HTMLVideoElement>(`video[data-plus-sub-id="${id}"]`);

  const videoObservable = initVideo({ messageObservable });
  const highlightObservable = initHighlight({ messageObservable, getElementFrom });
  // initSubtitle({ getElementFrom: (id: string) => videoMap.getElementFrom(id), messageObservable });
  // initTime({
  //   getElementFrom: (id: string) => videoMap.getElementFrom(id),
  //   messageObservable
  // });
  //
  merge(requestForRegisterMeFromPopupObservable, registerAckFromPopupObservable, unmountFromPopupObservable, videoObservable, highlightObservable).subscribe();
  postMessage({ plusSubActionFromContentScript: 'REGISTER_ME_REQUEST_FROM_IFRAME' });
})();