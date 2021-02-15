import { combineLatest, fromEvent, Subject } from 'rxjs';
import { distinct, filter, share, startWith } from 'rxjs/operators';
import { postMessage } from './postMessage';
import { init as initHighlight } from './highlight';
import { init as initVideo } from './video';
import { init as initSubtitle } from './subtitle';
import { init as initTime } from './time';
import { MessageEventFromPopup } from './types';

(async () => {
  const connectionSubject = new Subject<boolean>();
  const connectionObservable = connectionSubject.pipe(startWith(false));

  const messageObservable = fromEvent<MessageEvent>(window.self, 'message').pipe(
    filter<MessageEvent, MessageEventFromPopup<string>>((e): e is MessageEventFromPopup<string> => typeof e.data.plusSubActionFromPopup === 'string'),
    share()
  );

  messageObservable.subscribe((e) => console.warn(e.data));

  type RequestForRegisterMessageEvent = MessageEventFromPopup<'REQUEST_FOR_REGISTER'> & { data: { id: string } };

  combineLatest([
    connectionObservable,
    messageObservable.pipe(filter<MessageEventFromPopup<string>, RequestForRegisterMessageEvent>((e): e is RequestForRegisterMessageEvent => e.data.plusSubActionFromPopup === 'REQUEST_FOR_REGISTER'))
  ])
    .pipe(
      filter(([connected]) => !connected),
      distinct(([, x]) => x.data.id)
    )
    .subscribe((v) => postMessage({ plusSubActionFromContentScript: 'REGISTER_ME_REQUEST_FROM_IFRAME' }));

  messageObservable
    .pipe(filter<MessageEventFromPopup<string>, MessageEventFromPopup<'REGISTER_ACK'>>((e): e is MessageEventFromPopup<'REGISTER_ACK'> => e.data.plusSubActionFromPopup === 'REGISTER_ACK'))
    .subscribe(() => connectionSubject.next(true));

  messageObservable
    .pipe(filter<MessageEventFromPopup<string>, MessageEventFromPopup<'UNMOUNT'>>((e): e is MessageEventFromPopup<'UNMOUNT'> => e.data.plusSubActionFromPopup === 'UNMOUNT'))
    .subscribe(() => connectionSubject.next(false));

  const { videoMap } = initVideo({ messageObservable, connectionObservable });
  initHighlight({ getElementFrom: (id: string) => videoMap.getElementFrom(id), messageObservable });
  initSubtitle({ getElementFrom: (id: string) => videoMap.getElementFrom(id), messageObservable });
  initTime({
    getElementFrom: (id: string) => videoMap.getElementFrom(id),
    messageObservable
  });

  postMessage({ plusSubActionFromContentScript: 'REGISTER_ME_REQUEST_FROM_IFRAME' });
})();
