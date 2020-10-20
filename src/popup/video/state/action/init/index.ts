import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { RemoveVideoInIFrame, useElementMutationObserver, useMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';

export const addSrcToVideoInHost = (el: HTMLVideoElement): void => {
  const { src } = el;
  srcToVideo.value[src] = { el, hasSubtitle: el.classList.contains('plussub'), src, in: 'HOST' };
};

export const removeSrcToVideoInHost = (src: string): void => {
  if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) reset();
  delete srcToVideo.value[src];
};

export const isValidVideoInHost = (el: HTMLVideoElement): boolean => {
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
            removeSrcToVideoInHost(oldSrc);
            oldSrc = src;
            if (!src) return;
            addSrcToVideoInHost(el);
          }
          if (!inVideoList && !srcToVideo.value[src]) {
            inVideoList = true;
            oldSrc = src;
            addSrcToVideoInHost(el);
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
        removeSrcToVideoInHost(oldSrc);
        oldSrc = el.src;
        if (!el.src) return;
        addSrcToVideoInHost(el);
      }
    }
  });
  return true;
};

const isValidVideoInHost = (el: HTMLVideoElement) => isValidVideo({ videoIn: 'HOST', el });

const findVideoElement = (nodes: Node[]) => {
  const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
  if (directMatch) {
    return [directMatch];
  }
  return nodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);
};

const addedVideoElements = (mutationsList: MutationRecord[]): HTMLVideoElement[] => {
  return mutationsList.flatMap((mutation) => findVideoElement(Array.from(mutation.addedNodes)));
};

const removedVideoElements = (mutationsList: MutationRecord[]): HTMLVideoElement[] => {
  return mutationsList.flatMap((mutation) => findVideoElement(Array.from(mutation.removedNodes)));
};

interface initObserveAddedRemovedVideoPayload {
  videoIn: 'HOST' | 'I_FRAME';
  frameSrc?: string;
}

export const initObserveAddedRemovedVideo = ({ videoIn, frameSrc }: initObserveAddedRemovedVideoPayload): void => {
  useMutationObserver((mutationsList) => {
    addedVideoElements(mutationsList).forEach((el) => addSrcToVideo({ videoIn, el, frameSrc }));
    removedVideoElements(mutationsList).forEach((el) => removeSrcToVideo({ videoIn, src: el.src }));
  });
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
        srcToVideo.value[src] = { hasSubtitle, src, in: 'I_FRAME' };
      }
    }
  });
  useWindowMessage({
    [RemoveVideoInIFrame]: ({ data: { src } }) => {
      if (srcToVideo.value[src]) {
        if (srcToVideo.value[src].hasSubtitle) {
          reset();
        }
        delete srcToVideo.value[src];
      }
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

  const findVideoElement = (nodes: Node[]) => {
    const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
    if (directMatch) return [directMatch];

    return nodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);
  };

  useMutationObserver((mutationsList) =>
    mutationsList.forEach((mutation) => {
      findVideoElement(Array.from(mutation.removedNodes)).forEach((el) => {
        removeSrcToVideoInHost(el.src);
      });
      findVideoElement(Array.from(mutation.addedNodes)).forEach((el) => {
        if (!isValidVideoInHost(el)) return;
        addSrcToVideoInHost(el);
      });
    })
  );
};
