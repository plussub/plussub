import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { useMutationObserver, useElementMutationObserver, useWindowMessage, VideoInIFrame, RemoveVideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { addSrcToVideo, removeSrcToVideo } from '../srcToVideo';

interface isValidVideoPayload {
  el: HTMLVideoElement;
  frameSrc?: string;
}

export const isValidVideo = ({ el, frameSrc }: isValidVideoPayload): boolean => {
  if (!el || !el.offsetWidth || !el.offsetHeight) return false;
  let oldSrc = '';
  if (!el.src && !el.querySelector('source')) {
    let inVideoList = false;
    // for cases that video element does not have src first, but will add src after the video is playing. (eg. vimeo.com)
    useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
      const { src } = el;
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'src') {
          if (inVideoList) {
            removeSrcToVideo({ src: oldSrc });
            oldSrc = src;
            if (!src) return;
            addSrcToVideo({ el, frameSrc });
          }
          if (!inVideoList && !srcToVideo.value[src]) {
            inVideoList = true;
            oldSrc = src;
            addSrcToVideo({ el, frameSrc });
          }
        }
      }
    });
    return false;
  }
  oldSrc = el.src;
  // for cases that the src of video changes (eg. when change video in vimeo.com or bilibil.com)
  useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'src') {
        removeSrcToVideo({ src: oldSrc });
        oldSrc = el.src;
        if (!el.src) return;
        addSrcToVideo({ el, frameSrc });
      }
    }
  });
  return true;
};

const isValidVideoInHost = (el: HTMLVideoElement) => isValidVideo({ el });

const findVideoElement = (nodes: Node[]) => {
  const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
  if (directMatch) return [directMatch];

  return nodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);
};

interface initObserveAddedRemovedVideoPayload {
  frameSrc?: string;
}

export const initObserveAddedRemovedVideo = ({ frameSrc }: initObserveAddedRemovedVideoPayload): void => {
  useMutationObserver((mutationsList) =>
    mutationsList.forEach((mutation) => {
      findVideoElement(Array.from(mutation.removedNodes)).forEach((el) => {
        removeSrcToVideo({ src: el.src });
      });
      findVideoElement(Array.from(mutation.addedNodes)).forEach((el) => {
        if (!isValidVideoInHost(el)) return;
        addSrcToVideo({ el, frameSrc });
      });
    })
  );
};

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .filter(isValidVideoInHost)
    .map(
      (el): Video => ({
        src: el.src,
        in: 'HOST',
        hasSubtitle: el.classList.contains('plussub'),
        el
      })
    )
    .reduce((acc, cur) => ({ ...acc, [cur.src]: cur }), {});

export const init = (): void => {
  srcToVideo.value = findVideosInCurrentTab();
  useWindowMessage({
    [VideoInIFrame]: ({ origin, source, data: { src, frameSrc, hasSubtitle } }) => {
      if (!srcToVideo.value[src]) {
        srcToIFrameSource[src] = { window: source as Window, frameSrc, origin };
        srcToVideo.value[src ?? frameSrc] = { hasSubtitle, src, in: 'I_FRAME' };
      }
    },
    [RemoveVideoInIFrame]: ({ data: { src } }) => {
      removeSrcToVideo({ src });
    }
  });

  const videosWithSubtitle = computed(() => Object.values(srcToVideo.value).filter((e) => e.hasSubtitle));
  watch(
    () => window.plusSub_subtitle.value.withOffsetParsed,
    (subtitle) =>
      videosWithSubtitle.value.forEach((video) => {
        removeVttFrom({ video });
        addVttTo({ video, subtitle });
      })
  );

  initObserveAddedRemovedVideo({});
};
