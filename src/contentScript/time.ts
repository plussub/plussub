import { fromEvent, merge, Observable } from 'rxjs';
import { distinct, filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { postMessage } from './postMessage';
import { MessageEventFromPopup } from './types';

export interface Payload {
  messageObservable: Observable<MessageEvent>;
  getElementFrom: (id: string) => HTMLVideoElement | null;
}

export const init = ({ messageObservable, getElementFrom }: Payload) => {
  type SetTimeMessageEvent = MessageEventFromPopup<'SET_TIME'> & { data: { id: string; time: number } };

  const setTimeFromPopupObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, SetTimeMessageEvent>((e): e is SetTimeMessageEvent => e.data.plusSubActionFromPopup === 'SET_TIME'),
    map<SetTimeMessageEvent, { el: HTMLVideoElement | null; messageEvent: SetTimeMessageEvent }>((messageEvent) => ({
      el: getElementFrom(messageEvent.data.id),
      messageEvent
    })),
    filter<{ el: HTMLVideoElement | null; messageEvent: SetTimeMessageEvent }, { el: HTMLVideoElement; messageEvent: SetTimeMessageEvent }>(
      (value): value is { el: HTMLVideoElement; messageEvent: SetTimeMessageEvent } => value.el !== null
    ),
    tap(({ el, messageEvent }) => (el.currentTime = messageEvent.data.time))
  );

  type SubscribeToTimeUpdateMessageEvent = MessageEventFromPopup<'SUBSCRIBE_TO_TIME_UPDATE'> & { data: { video: { id: string }; subscription: { id: string } } };
  type UnsubscribeToTimeUpdateMessageEvent = MessageEventFromPopup<'UNSUBSCRIBE_TO_TIME_UPDATE'> & { data: { subscription: { id: string } } };

  const subscribeToTimeUpdateObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, SubscribeToTimeUpdateMessageEvent>((e): e is SubscribeToTimeUpdateMessageEvent => e.data.plusSubActionFromPopup === 'SUBSCRIBE_TO_TIME_UPDATE'),
    map<SubscribeToTimeUpdateMessageEvent, { el: HTMLVideoElement | null; messageEvent: SubscribeToTimeUpdateMessageEvent }>((messageEvent) => ({
      el: getElementFrom(messageEvent.data.video.id),
      messageEvent
    })),
    filter<{ el: HTMLVideoElement | null; messageEvent: SubscribeToTimeUpdateMessageEvent }, { el: HTMLVideoElement; messageEvent: SubscribeToTimeUpdateMessageEvent }>(
      (value): value is { el: HTMLVideoElement; messageEvent: SubscribeToTimeUpdateMessageEvent } => value.el !== null
    ),
    distinct(({ messageEvent }) => messageEvent.data.subscription.id),
    mergeMap(({ el, messageEvent }) =>
      fromEvent(el, 'timeupdate').pipe(
        takeUntil(
          messageObservable.pipe(
            filter<MessageEventFromPopup<string>, UnsubscribeToTimeUpdateMessageEvent>((e): e is UnsubscribeToTimeUpdateMessageEvent => e.data.plusSubActionFromPopup === 'UNSUBSCRIBE_TO_TIME_UPDATE'),
            filter((_messageEvent) => messageEvent.data.subscription.id === _messageEvent.data.subscription.id)
          )
        )
      )
    ),
    tap((event) =>
      postMessage({
        plusSubActionFromContentScript: 'TIME_UPDATE',
        time: (event.target as HTMLVideoElement).currentTime
      })
    )
  );

  return merge(setTimeFromPopupObservable, subscribeToTimeUpdateObservable);
};
