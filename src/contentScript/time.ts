import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { postMessage } from './postMessage';

export interface Payload {
  messageObservable: Observable<MessageEvent>;
  connectionObservable: Observable<boolean>;
  getElementFrom: (id: string) => HTMLVideoElement | null;
}

export const init = ({ messageObservable, connectionObservable, getElementFrom }: Payload) => {
  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; id: string; time: number }>>(filter((k) => k.data.plusSubActionFromPopup === 'SET_TIME')).subscribe((e) => {
    const el = getElementFrom(e.data.id);
    if (!el) {
      return;
    }
    el.currentTime = e.data.time;
  });

  const idToSubscription = new Map<string, Subscription>();
  const elToObservable = new Map<HTMLVideoElement, Observable<Event>>();

  messageObservable
    .pipe<MessageEvent<{ plusSubActionFromPopup: string; video: { id: string }; subscription: { id: string } }>>(
      filter((k) => k.data.plusSubActionFromPopup === 'SUBSCRIBE_TO_TIME_UPDATE'),
    )
    .subscribe((e) => {
      const el = getElementFrom(e.data.video.id);
      if (!el || idToSubscription.has(e.data.subscription.id)) {
        return;
      }
      const observable = elToObservable.get(el) ?? fromEvent(el, 'timeupdate');
      elToObservable.set(el, observable);

      idToSubscription.set(
        e.data.subscription.id,
        observable.subscribe(() =>
          postMessage({
            plusSubActionFromContentScript: 'TIME_UPDATE',
            time: el.currentTime
          })
        )
      );
    });

  messageObservable
    .pipe<MessageEvent<{ plusSubActionFromPopup: string; subscription: { id: string } }>>(filter((k) => k.data.plusSubActionFromPopup === 'UNSUBSCRIBE_TO_TIME_UPDATE'))
    .subscribe((e) => {
      const subscription = idToSubscription.get(e.data.subscription.id);
      if(!subscription){
       return;
      }
      subscription.unsubscribe();
      idToSubscription.delete(e.data.subscription.id);
    });

  connectionObservable.subscribe((connected) => {
    if (!connected) {
      [...idToSubscription.values()].forEach((subscription) => subscription.unsubscribe());
      idToSubscription.clear();

    }
  });
};
