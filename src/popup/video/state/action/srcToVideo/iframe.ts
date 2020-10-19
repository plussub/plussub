import { postWindowMessage, VideoInIFrame, RemoveVideoInIFrame } from '@/composables';

export const addSrcToVideoInIframe = (el: HTMLVideoElement, frameSrc: string): void => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: VideoInIFrame,
      frameSrc,
      src: el.src,
      hasSubtitle: el.classList.contains('plussub')
    }
  });
};

export const removeSrcToVideoInIframe = (src: string): void => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: RemoveVideoInIFrame,
      src
    }
  });
};
