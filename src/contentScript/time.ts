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

  let timeUpdateSubscription: Subscription | undefined;
  const elToCount = new Map<HTMLVideoElement, number>();
  messageObservable
    .pipe<MessageEvent<{ plusSubActionFromPopup: string; video: { id: string }; subscription: { id: string } }>>(filter((k) => k.data.plusSubActionFromPopup === 'SUBSCRIBE_TO_TIME_UPDATE'))
    .subscribe((e) => {
      const el = getElementFrom(e.data.video.id);
      if (!el) {
        return;
      }
      const count = elToCount.get(el) ?? 0;

      if(count > 0){
        elToCount.set(el, count+1);
        return;
      }
      elToCount.set(el, 1);
      // timeUpdateSubscription?.unsubscribe();
      timeUpdateSubscription = fromEvent(el, 'timeupdate').subscribe(() => {
        postMessage({
          plusSubActionFromContentScript: 'TIME_UPDATE',
          time: el.currentTime
        });
      });
    });

  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; video: { id: string }, subscription: { id: string } }>>(filter((k) => k.data.plusSubActionFromPopup === 'UNSUBSCRIBE_TO_TIME_UPDATE')).subscribe((e) => {
    const el = getElementFrom(e.data.video.id);
    if (!el) {
      return;
    }
    const count = elToCount.get(el) ?? 0;
    elToCount.set(el, count>0 ? count-1 : 0);
    if(count-1 <= 0){
      timeUpdateSubscription?.unsubscribe();
    }
  });

  connectionObservable.subscribe((connected) => {
    if (!connected) {
      timeUpdateSubscription?.unsubscribe();
    }
  });
};
