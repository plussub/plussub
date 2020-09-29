import { SrtEntry } from '@/appState';

interface AddVttToPayload {
  el: HTMLVideoElement;
  subtitle: SrtEntry[];
}

interface RemoveVttFromPayload {
  el: HTMLVideoElement;
}

interface VideoInIframe {
  src: string;
  hasSubtitle: boolean;
}

export const addVttTo = ({ el, subtitle }: AddVttToPayload): void => {
  const cues = subtitle.map((srt) => new VTTCue(srt.from / 1000, srt.to / 1000, `<c.plussub>${srt.text}</c.plussub>`));
  Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
  const track = el.addTextTrack('subtitles', `Plussub`, 'en');
  cues.forEach((cue) => track.addCue(cue));
  track.mode = 'showing';
  el.classList.add('plussub');
};

export const removeVttFrom = ({ el }: RemoveVttFromPayload): void => {
  el.classList.remove('plussub');
  Array.from(el.textTracks)
    .filter((track) => track.label === 'Plussub')
    .forEach((track) => (track.mode = 'disabled'));
  // hidden cannot work on some website(like yhdm.tv)
};

export const addVttToIframe = (videoInIframe: VideoInIframe, subtitle: SrtEntry[]): void => {
  const iframe = <HTMLIFrameElement>document.querySelector(`iframe[src="${videoInIframe.src}"]`);
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ plusSubAction: 'addSubtitle', data: JSON.stringify(subtitle) }, '*');
  }
  videoInIframe.hasSubtitle = true;
};

export const removeVttFromIframe = (videoInIframe: VideoInIframe): void => {
  const iframe = <HTMLIFrameElement>document.querySelector(`iframe[src="${videoInIframe.src}"]`);
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ plusSubAction: 'removeSubtitle' }, '*');
  }
  videoInIframe.hasSubtitle = false;
};
