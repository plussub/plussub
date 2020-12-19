import { Video } from '@/video/state/types';
import { SubtitleEntry } from '@/subtitle/state/types';

export interface AddVttToHostVideoPayload {
  video: Pick<Video, 'el'>;
  subtitles: SubtitleEntry[];
  subtitleId: string;
}

const cues: Record<string, VTTCue[]> = {};

export const addVttToHostVideo = ({ video: { el }, subtitles, subtitleId }: AddVttToHostVideoPayload): void => {
  if (!el) {
    return;
  }
  if (cues[subtitleId]) {
    cues[subtitleId].forEach((c, idx) => {
      c.startTime = subtitles[idx].from / 1000;
      c.endTime = subtitles[idx].to / 1000;
    });
    return;
  }
  cues[subtitleId] = subtitles.map((srt) => new VTTCue(srt.from / 1000, srt.to / 1000, `<c.plussub>${srt.text}</c.plussub>`));
  Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
  const track = el.addTextTrack('subtitles', `Plussub`, 'en');
  cues[subtitleId].forEach((cue) => track.addCue(cue));
  track.mode = 'showing';
  el.classList.add('plussub');
};

interface RemoveVttFromHostVideoPayload {
  video: Pick<Video, 'el'>;
}

export const removeVttFromHostVideo = ({ video: { el } }: RemoveVttFromHostVideoPayload): void => {
  if (!el) {
    return;
  }
  Object.keys(cues).forEach((k) => delete cues[k]);
  el.classList.remove('plussub');
  Array.from(el.textTracks)
    .filter((track) => track.label === 'Plussub')
    .forEach((track) => (track.mode = 'disabled'));
  // change from hidden to disable as hidden cannot work on some website(eg. yhdm.tv)
};
