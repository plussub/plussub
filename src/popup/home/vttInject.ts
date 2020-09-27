import { SrtEntry } from '@/appState';
import { useStore } from '../store/index';

interface AddVttToPayload {
  el: HTMLVideoElement;
  subtitle: SrtEntry[];
}

interface RemoveVttFromPayload {
  el: HTMLVideoElement;
}

interface AddVttToIframePayload {
  src: string;
  subtitle: SrtEntry[];
}

interface RemoveVttFromIframePayload {
  src: string;
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

export const addVttToIframe = ({ src, subtitle }: AddVttToIframePayload): void => {
  const iframe = <HTMLIFrameElement>document.querySelector(`iframe[src="${src}"]`);
  if (iframe) {
    iframe.contentWindow?.postMessage({ PlusSubAction: 'addSubtitle', data: JSON.stringify(subtitle) }, '*');
    const store = useStore();
    store.commit('videoInIframe/setSubtitleStatus', { src, hasSubtitle: true });
  }
};

export const removeVttFromIframe = ({ src }: RemoveVttFromIframePayload): void => {
  const iframe = <HTMLIFrameElement>document.querySelector(`iframe[src="${src}"]`);
  if (iframe) {
    iframe.contentWindow?.postMessage({ PlusSubAction: 'removeSubtitle' }, '*');
    const store = useStore();
    store.commit('videoInIframe/setSubtitleStatus', { src, hasSubtitle: false });
  }
};
