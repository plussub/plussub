import { addSrcToVideoInHost, removeSrcToVideoInHost } from './host';
import { addSrcToVideoInIframe, removeSrcToVideoInIframe } from './iframe';

interface addSrcToVideoPayload {
  videoIn: 'HOST' | 'I_FRAME';
  el: HTMLVideoElement;
  frameSrc?: string;
}

export const addSrcToVideo = ({ videoIn, el, frameSrc = '' }: addSrcToVideoPayload): void => {
  if (videoIn === 'HOST') {
    addSrcToVideoInHost(el);
  } else {
    addSrcToVideoInIframe(el, frameSrc);
  }
};

interface removeSrcToVideoPayload {
  videoIn: 'HOST' | 'I_FRAME';
  src: string;
}

export const removeSrcToVideo = ({ videoIn, src }: removeSrcToVideoPayload): void => {
  if (videoIn === 'HOST') {
    removeSrcToVideoInHost(src);
  } else {
    removeSrcToVideoInIframe(src);
  }
};
