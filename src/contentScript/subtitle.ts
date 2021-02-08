import {filter} from "rxjs/operators";
import {Observable} from "rxjs";

interface SubtitlePayload {
  video: {
    id: string;
  }
  subtitle: {
    id,
    entries: { from: number; to: number; text: string }[],
    language: string;
  }
}

export interface Payload {
  messageObservable: Observable<MessageEvent>;
  getElementFrom: (id: string) => HTMLVideoElement |null;
}

export const init = ({messageObservable, getElementFrom} :Payload) => {

  const cues: Record<string, VTTCue[]> = {};

  messageObservable
    .pipe<MessageEvent<{ plusSubActionFromPopup: string;} & SubtitlePayload>>(
      filter((k) => k.data.plusSubActionFromPopup === 'ADD_SUBTITLE')
    )
    .subscribe((e) => {
      const el = getElementFrom(e.data.video.id);
      if (!el) {
        return;
      }
      if (cues[e.data.subtitle.id] && cues[e.data.subtitle.id].length === e.data.subtitle.entries.length) {
        cues[e.data.subtitle.id].forEach((c, idx) => {
          c.startTime = e.data.subtitle.entries[idx].from / 1000;
          c.endTime = e.data.subtitle.entries[idx].to / 1000;
        });
        return;
      }
      cues[e.data.subtitle.id] = e.data.subtitle.entries.map((vtt) => new VTTCue(vtt.from / 1000, vtt.to / 1000, `<c.plussub>${vtt.text}</c.plussub>`));
      Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
      const track = el.addTextTrack('subtitles', `PlusSub`, e.data.subtitle.language);
      cues[e.data.subtitle.id].forEach((cue) => track.addCue(cue));
      track.mode = 'showing';
      el.classList.add('plusSub');
    });

  messageObservable
    .pipe<MessageEvent<{ plusSubActionFromPopup: string;} & SubtitlePayload>>(
      filter((k) => k.data.plusSubActionFromPopup === 'REMOVE_SUBTITLE')
    )
    .subscribe((e) => {
      const el = getElementFrom(e.data.video.id);
      if (!el) {
        return;
      }
      Object.keys(cues).forEach((k) => delete cues[k]);
      el.classList.remove('plusSub');
      Array.from(el.textTracks).filter((track) => track.label === 'PlusSub').forEach((track) => (track.mode = 'disabled'));
    });
}
