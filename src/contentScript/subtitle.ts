import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MessageEventFromPopup } from './types';

export interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
  getElementFrom: (id: string) => HTMLVideoElement | null;
}

export const init = ({ messageObservable, getElementFrom }: Payload) => {
  //todo: to data stream lolz
  const idToCues = new Map<string, VTTCue[]>();

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

  const addSubtitleObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, AddSubtitleMessageEvent>((e): e is AddSubtitleMessageEvent => e.data.plusSubActionFromPopup === 'ADD_SUBTITLE'),
    map<AddSubtitleMessageEvent, { el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }>((messageEvent) => ({
      el: getElementFrom(messageEvent.data.video.id),
      messageEvent
    })),
    filter<{ el: HTMLVideoElement | null; messageEvent: AddSubtitleMessageEvent }, { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent }>(
      (value): value is { el: HTMLVideoElement; messageEvent: AddSubtitleMessageEvent } => value.el !== null
    )
  );

  // if subtitle id matched, adjust only the time
  addSubtitleObservable
    .pipe(filter(({ messageEvent }) => idToCues.has(messageEvent.data.subtitle.id)))
    .subscribe(({ messageEvent }) => {
      idToCues.get(messageEvent.data.subtitle.id)!.forEach((c, idx) => {
        c.startTime = messageEvent.data.subtitle.entries[idx].from / 1000;
        c.endTime = messageEvent.data.subtitle.entries[idx].to / 1000;
      });
    });

  addSubtitleObservable
    .pipe(filter(({ messageEvent }) => !idToCues.has(messageEvent.data.subtitle.id)))
    .subscribe(({ el, messageEvent }) => {
      idToCues.set(messageEvent.data.subtitle.id, messageEvent.data.subtitle.entries.map((vtt) => new VTTCue(vtt.from / 1000, vtt.to / 1000, `<c.plussub>${vtt.text}</c.plussub>`)));
      Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
      const track = el.addTextTrack('subtitles', `PlusSub`, messageEvent.data.subtitle.language);
      idToCues.get(messageEvent.data.subtitle.id)!.forEach((cue) => track.addCue(cue));
      track.mode = 'showing';
      el.classList.add('plusSub');
    });


  type RemoveSubtitleMessageEvent = MessageEventFromPopup<'REMOVE_SUBTITLE'> & {
    data: {
      video: {
        id;
      };
    };
  };

  messageObservable
    .pipe(
      filter<MessageEventFromPopup<string>, RemoveSubtitleMessageEvent>((e): e is RemoveSubtitleMessageEvent => e.data.plusSubActionFromPopup === 'REMOVE_SUBTITLE'),
      map<RemoveSubtitleMessageEvent, { el: HTMLVideoElement | null; messageEvent: RemoveSubtitleMessageEvent }>((messageEvent) => ({
        el: getElementFrom(messageEvent.data.video.id),
        messageEvent
      })),
      filter<{ el: HTMLVideoElement | null; messageEvent: RemoveSubtitleMessageEvent }, { el: HTMLVideoElement; messageEvent: RemoveSubtitleMessageEvent }>(
        (value): value is { el: HTMLVideoElement; messageEvent: RemoveSubtitleMessageEvent } => value.el !== null
      )
    )
    .subscribe(({ el }) => {
      idToCues.clear();
      el.classList.remove('plusSub');
      Array.from(el.textTracks)
        .filter((track) => track.label === 'PlusSub')
        .forEach((track) => (track.mode = 'disabled'));
    });
};
