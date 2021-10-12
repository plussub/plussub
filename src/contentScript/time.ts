import { Observable } from 'rxjs';
import {  filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ContentScriptInputMessageEvent } from './types';

export interface Payload {
  inputObservable: Observable<MessageEvent>;
  getVideoElementFrom: (id: string) => HTMLVideoElement | null;
}

type SetTimeMessageEvent = ContentScriptInputMessageEvent<'SET_TIME'> & { data: { id: string; time: number } };

export const init = ({ inputObservable, getVideoElementFrom }: Payload) => {
  return inputObservable.pipe(
    filter((e): e is SetTimeMessageEvent => e.data.plusSubContentScriptInput === 'SET_TIME'),
    map<SetTimeMessageEvent, { el: HTMLVideoElement | null; messageEvent: SetTimeMessageEvent }>((messageEvent) => ({
      el: getVideoElementFrom(messageEvent.data.id),
      messageEvent
    })),
    filter((value): value is { el: HTMLVideoElement; messageEvent: SetTimeMessageEvent } => value.el !== null),
    tap(({ el, messageEvent }) => (el.currentTime = messageEvent.data.time))
  );
};
