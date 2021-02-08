import {fromEvent, Observable, Subscription} from 'rxjs';
import { filter } from 'rxjs/operators';
import {postMessage} from "./postMessage";

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
  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; id: string; }>>(filter((k) => k.data.plusSubActionFromPopup === 'ENABLE_TIME_UPDATE')).subscribe((e) => {
    const el = getElementFrom(e.data.id);
    if (!el) {
      return;
    }
    timeUpdateSubscription?.unsubscribe();
    timeUpdateSubscription = fromEvent(el, 'timeupdate').subscribe(() => {
      postMessage({
        plusSubActionFromContentScript: "TIME_UPDATE",
        time: el.currentTime
      });
    });
  });

  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; id: string; }>>(filter((k) => k.data.plusSubActionFromPopup === 'DISABLE_TIME_UPDATE')).subscribe((e) => {
    timeUpdateSubscription?.unsubscribe();
  });

  connectionObservable.subscribe((connected) => {
    if(!connected){
      timeUpdateSubscription?.unsubscribe();
    }
  });
};
