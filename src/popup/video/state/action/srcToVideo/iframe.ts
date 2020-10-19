import { postWindowMessage, VideoInIFrame, RemoveVideoInIFrame } from '@/composables';

export const addSrcToVideoInIframe = (el: HTMLVideoElement, frameSrc: string): void => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: VideoInIFrame,
      // frameSrc: props.frameSrc,
      // src: props.videoEl.src,
      // TODO: still use framesrc as property name to clarify the meaning
      src: frameSrc,
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
