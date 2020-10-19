import { addSrcToVideoInHost, removeSrcToVideoInHost } from './host';
import { addSrcToVideoInIframe, removeSrcToVideoInIframe } from './iframe';

interface addSrcToVideoPayload {
  el: HTMLVideoElement;
  frameSrc?: string;
}
const inHost = window.self === window.top;

export const addSrcToVideo = ({ el, frameSrc = '' }: addSrcToVideoPayload): void => {
  if (inHost) {
    addSrcToVideoInHost(el);
  } else {
    addSrcToVideoInIframe(el, frameSrc);
  }
};

interface removeSrcToVideoPayload {
  src: string;
}

export const removeSrcToVideo = ({ src }: removeSrcToVideoPayload): void => {
  if (inHost) {
    removeSrcToVideoInHost(src);
  } else {
    removeSrcToVideoInIframe(src);
  }
};
