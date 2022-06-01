import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ContentScriptInputMessageEvent,
  EXTENSION_LABEL,
  EXTENSION_ORIGIN,
  GenericContentScriptInputMessageEvent
} from './types';

declare global {
  interface Window {
    cue: Record<string, unknown>;
  }
}

export interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
  getVideoElementFrom: (id: string) => HTMLVideoElement | null;
}

type AddSubtitleMessageEvent = ContentScriptInputMessageEvent<'ADD_SUBTITLE', {
  video: {
    id: string;
  };
  subtitle: {
    id;
    entries: { from: number; to: number; text: string }[];
    language: string;
  };
}>;

export const init = ({ inputObservable, getVideoElementFrom }: Payload): Observable<unknown> => {
  return inputObservable.pipe(
    filter((e): e is AddSubtitleMessageEvent => e.data.contentScriptInput === 'ADD_SUBTITLE'),
    map<AddSubtitleMessageEvent, { el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }>((messageEvent) => ({
      el: getVideoElementFrom(messageEvent.data.video.id),
      messageEvent
    })),
    filter((value): value is { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent } => value.el !== null),
    map<{ el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent }, { track: TextTrack; entries: VTTCue[] }>(({ el, messageEvent }) => {
      el.dataset[`${EXTENSION_ORIGIN}Status`] = 'injected';

      const track = [...el.textTracks].find((track) =>
          track.label === EXTENSION_LABEL &&
          track.mode !== 'disabled' &&
          track['isFromExtension'])
        ?? el.addTextTrack('subtitles', EXTENSION_LABEL, messageEvent.data.subtitle.language);

      track['isFromExtension'] = true;

      return {
        track,
        entries: messageEvent.data.subtitle.entries.map((vtt) => {
          const cue = new VTTCue(vtt.from / 1000, vtt.to / 1000, `<c.${EXTENSION_ORIGIN}>${vtt.text}</c.${EXTENSION_ORIGIN}>`);
          cue.size = 100;
          Object.assign(cue, window.cue);
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
