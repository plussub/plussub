import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ContentScriptInputMessageEvent } from './types';

export interface Payload {
  inputObservable: Observable<ContentScriptInputMessageEvent<string>>;
  getVideoElementFrom: (id: string) => HTMLVideoElement | null;
}

type AddSubtitleMessageEvent = ContentScriptInputMessageEvent<'ADD_SUBTITLE'> & {
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

export const init = ({ inputObservable, getVideoElementFrom }: Payload): Observable<unknown> => {
  return inputObservable.pipe(
    filter((e): e is AddSubtitleMessageEvent => e.data.plusSubContentScriptInput === 'ADD_SUBTITLE'),
    map<AddSubtitleMessageEvent, { el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }>((messageEvent) => ({
      el: getVideoElementFrom(messageEvent.data.video.id),
      messageEvent
    })),
    filter((value): value is { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent } => value.el !== null),
    map<{ el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent }, { track: TextTrack; entries: VTTCue[] }>(({ el, messageEvent }) => {
      el.dataset.plusSubStatus = 'injected';

      const track = [...el.textTracks].find((track) =>
          track.label === '+Sub' &&
          track.mode !== 'disabled' &&
          track['isPlusSub'])
        ?? el.addTextTrack('subtitles', `+Sub`, messageEvent.data.subtitle.language);

      track['isPlusSub'] = true;

      return {
        track,
        entries: messageEvent.data.subtitle.entries.map((vtt) => {
          const cue = new VTTCue(vtt.from / 1000, vtt.to / 1000, `<c.plussub>${vtt.text}</c.plussub>`);
          cue.size = 100;
          return cue;
        })
      };
    }),
    tap(({ track, entries }) => {
      [...(track.cues ?? [])].forEach((cue) => track.removeCue(cue));
      entries.forEach((cue) => track.addCue(cue));
      track.mode = 'showing';
    })
  );
};
