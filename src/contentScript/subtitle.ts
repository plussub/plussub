import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { from, merge, Observable, partition } from 'rxjs';
import { MessageEventFromPopup } from './types';

export interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
  getElementFrom: (id: string) => HTMLVideoElement | null;
}

export const init = ({ messageObservable, getElementFrom }: Payload): Observable<any> => {
  type AddSubtitleMessageEvent = MessageEventFromPopup<'ADD_SUBTITLE'> & {
    data: {
      video: {
        id: string;
      };
      subtitle: {
        id;
        entries: { from: number; to: number; text: string }[];
        language: string;
      };
    };
  };

  const addSubtitleFromPopupObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, AddSubtitleMessageEvent>((e): e is AddSubtitleMessageEvent => e.data.plusSubActionFromPopup === 'ADD_SUBTITLE'),
    map<AddSubtitleMessageEvent, { el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }>((messageEvent) => ({
      el: getElementFrom(messageEvent.data.video.id),
      messageEvent
    })),
    filter<{ el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }, { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent }>(
      (value): value is { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent } => value.el !== null
    )
  );

  const oldIdsObservable = addSubtitleFromPopupObservable.pipe(
    mergeMap(({ el, messageEvent }) => from([...el.textTracks].filter((track) => track.label === 'PlusSub' && track.mode !== 'disabled' && track['plusSubId'] !== messageEvent.data.subtitle.id)))
  );

  const addSubtitleObservable = addSubtitleFromPopupObservable.pipe(
    map<{ el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent }, { track: TextTrack; messageEvent: AddSubtitleMessageEvent }>(({ el, messageEvent }) => {
      const track =
        [...el.textTracks].find((track) => track.label === '+Sub' && (track.mode !== 'disabled' || track['plusSubId'] === messageEvent.data.subtitle.id)) ??
        el.addTextTrack('subtitles', `+Sub`, messageEvent.data.subtitle.language);

      track['plusSubId'] = messageEvent.data.subtitle.id;

      return {
        track,
        messageEvent
      };
    }),
    tap(({ track, messageEvent }) => {
      [...(track.cues ?? [])].forEach((cue) => track.removeCue(cue));
      messageEvent.data.subtitle.entries
        .map((vtt) => {
          const cue =  new VTTCue(vtt.from / 1000, vtt.to / 1000, `<c.plussub>${vtt.text}</c.plussub>`);
          cue.size = 100;
          return cue;
        })
        .forEach((cue) => track.addCue(cue));
      track.mode = 'showing';
    })
  );

  type RemoveSubtitleMessageEvent = MessageEventFromPopup<'REMOVE_SUBTITLE'> & {
    data: {
      video: {
        id;
      };
    };
  };

  const removeSubtitleFromPopupObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, RemoveSubtitleMessageEvent>((e): e is RemoveSubtitleMessageEvent => e.data.plusSubActionFromPopup === 'REMOVE_SUBTITLE'),
    map<RemoveSubtitleMessageEvent, HTMLVideoElement | null>((messageEvent) => getElementFrom(messageEvent.data.video.id)),
    filter<HTMLVideoElement | null, HTMLVideoElement>((value): value is HTMLVideoElement => value !== null),
    map((el): TextTrack | null => [...el.textTracks].find((track) => track.label === '+Sub' && track.mode !== 'disabled') ?? null),
    filter((track): track is TextTrack => track !== null)
  );

  const removeSubtitleObservable = merge(oldIdsObservable, removeSubtitleFromPopupObservable).pipe(
    tap((track) => {
      [...(track.cues ?? [])].forEach((cue) => track.removeCue(cue));
      track.mode = 'hidden';
      track.mode = 'disabled';
    })
  );

  return merge(addSubtitleObservable, removeSubtitleObservable);
};
