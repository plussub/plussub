import {SrtEntry} from "@/appState";
import {isHTMLVideoElement} from "@/types";
import {Video} from "@/videoState/types";

export interface AddVttToHostVideoPayload {
  video: Pick<Video, 'el'>;
  subtitle: SrtEntry[];
}

export const addVttToHostVideo = ({ video: {el}, subtitle }: AddVttToHostVideoPayload): void => {
  if (!el) {
    return;
  }
  const cues = subtitle.map((srt) => new VTTCue(srt.from / 1000, srt.to / 1000, `<c.plussub>${srt.text}</c.plussub>`));
  Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
  const track = el.addTextTrack('subtitles', `Plussub`, 'en');
  cues.forEach((cue) => track.addCue(cue));
  track.mode = 'showing';
  el.classList.add('plussub');
};

interface RemoveVttFromHostVideoPayload {
  video: Pick<Video, 'el'>;
}

export const removeVttFromHostVideo = ({ video: {el}}: RemoveVttFromHostVideoPayload): void => {
  if (!el) {
    return;
  }
  el.classList.remove('plussub');
  Array.from(el.textTracks)
    .filter((track) => track.label === 'Plussub')
    .forEach((track) => (track.mode = 'disabled'));
  // hidden cannot work on some website(like yhdm.tv)
};
