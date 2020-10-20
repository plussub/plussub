import { useElementMutationObserver } from '@/composables';

interface isValidVideoPayload {
  videoIn: 'HOST' | 'I_FRAME';
  el: HTMLVideoElement;
  frameSrc?: string;
}

export const isValidVideo = ({ el }: isValidVideoPayload): boolean => {
  return el.offsetWidth !== 0 && el.offsetHeight !== 0 && (el.src !== null || el.querySelector('source') !== null);
};

export const registerElementMutation = ({ videoIn, el, frameSrc }: isValidVideoPayload): boolean => {
  // if (!el.offsetWidth || !el.offsetHeight) {
  //   return false;
  // }
  // let inVideoList = false;
  // let oldSrc = '';
  // if (!el.src && !el.querySelector('source')) {
  //   // (warning when use with onMount or onUnmount): onMount(onUnmount) is called when there is no active component instance to be associated with.
  //   // for cases that video element does not have src first, but will add src after the video is playing. (eg. vimeo.com)
  //   useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
  //     const { src } = el;
  //     for (const mutation of mutationsList) {
  //       if (mutation.attributeName === 'src') {
  //         if (inVideoList) {
  //           removeSrcToVideo({ videoIn, src: oldSrc });
  //           oldSrc = src;
  //           if (!src) return;
  //           addSrcToVideo({ videoIn, el, frameSrc });
  //         }
  //         if (!inVideoList && !srcToVideo.value[src]) {
  //           inVideoList = true;
  //           oldSrc = src;
  //           addSrcToVideo({ videoIn, el, frameSrc });
  //         }
  //       }
  //     }
  //   });
  //   return false;
  // }
  // oldSrc = el.src;
  // // for cases that the src of video changes (eg. when change video in vimeo.com or bilibil.com)
  // useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
  //   for (const mutation of mutationsList) {
  //     if (mutation.attributeName === 'src') {
  //       removeSrcToVideo({ videoIn, src: oldSrc });
  //       oldSrc = el.src;
  //       if (!el.src) return;
  //       addSrcToVideo({ videoIn, el, frameSrc });
  //     }
  //   }
  // });
  // return true;
};
