import { SrtEntry, VideoInIframe } from '@/appState';

interface AddVttToPayload {
  el: HTMLVideoElement;
  subtitle: SrtEntry[];
}

interface RemoveVttFromPayload {
  el: HTMLVideoElement;
}

interface AddVttToIframePayload {
  videoInIframe: VideoInIframe;
  subtitle: SrtEntry[];
}

interface RemoveVttFromIframePayload {
  videoInIframe: VideoInIframe;
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
    .forEach((track) => (track.mode = 'hidden'));
};

export const addVttToIframe = ({ videoInIframe, subtitle }: AddVttToIframePayload): void => {
  console.log(videoInIframe)
  const iframe = <HTMLIFrameElement>document.querySelector(`iframe[src="${videoInIframe.src}"]`)
  if (iframe) {
    iframe.contentWindow?.postMessage({ PlusSubAction: 'addSubtitle', data: JSON.stringify(subtitle) }, '*');
    videoInIframe.hasSubtitle = false;
  }
};

export const removeVttFromIframe = ({ videoInIframe }: RemoveVttFromIframePayload): void => {
  const iframe =  <HTMLIFrameElement>document.querySelector(`iframe[src="${videoInIframe.src}"]`);
  if (iframe) {
    iframe.contentWindow?.postMessage({ PlusSubAction: 'removeSubtitle' }, '*');
    videoInIframe.hasSubtitle = false;
  }
};
