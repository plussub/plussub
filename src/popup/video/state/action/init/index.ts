import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { useMutationObserver, useElementMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';

export const addSrcToVideo = (el: HTMLVideoElement): void => {
  const src = el.src ?? el.currentSrc;
  srcToVideo.value[src] = { el, hasSubtitle: el.classList.contains('plussub'), src, in: 'HOST' };
};

export const removeSrcToVideo = (src: string): void => {
  if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) reset();
  delete srcToVideo.value[src];
};

export const isValidVideoAndObserveSrcChange = (el: HTMLVideoElement): boolean => {
  if (!el || !el.offsetWidth || !el.offsetHeight) return false;
  // some video element has src but no currentSrc(eg. vimeo.com)
  let oldSrc = el.src ?? el.currentSrc;
  // for cases that the src of video changes (eg. when change video in vimeo.com or bilibil.com)
  // not listen to childlist of <source> currently as I don't find any cases and I don't think any video will change <source>
  useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'src') {
        removeSrcToVideo(oldSrc);
        oldSrc = el.src ?? el.currentSrc;
        if (!oldSrc) return;
        addSrcToVideo(el);
      }
    }
  });
  if (!oldSrc) return false;
  return true;
};

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .filter(isValidVideoAndObserveSrcChange)
    .map(
      (el): Video => ({
        src: el.src ?? el.currentSrc,
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

  useMutationObserver((mutationsList) => {
    removedVideoElements(mutationsList).forEach((el) => removeSrcToVideo(el.src ?? el.currentSrc));
    addedVideoElements(mutationsList).filter(isValidVideoAndObserveSrcChange).forEach(addSrcToVideo);
  });
};
