import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { useMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { setState } from '@/app/state';

const isValidVideo = (el: HTMLVideoElement): boolean => {
  const src = el.src;
  if (!(el.offsetWidth && el.offsetHeight)) return false;
  if (!src && !el.querySelector('source')) {
    // for cases that it does not have src first, but will add src after the video is playing. (eg. vimeo.com)
    useMutationObserver(el, { attributes: true, childList: true }, (mutationsList) => {
      for (const mutation of mutationsList) {
        if ((mutation.attributeName === 'src' || (mutation.addedNodes.length > 0 && isHTMLElement(mutation.addedNodes[0]) && mutation.addedNodes[0].tagName === 'source')) && !srcToVideo.value[src]) {
          srcToVideo.value[src] = { hasSubtitle: el.classList.contains('plussub'), src: src, in: 'HOST' };
        }
      }
    });
    return false;
  }
  return true;
};

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .filter(isValidVideo)
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
    [VideoInIFrame]: ({ origin, source, data: { src, hasSubtitle } }) => {
      if (!srcToVideo.value[src]) {
        srcToIFrameSource[src] = { window: source as Window, frameSrc: src, origin };
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
  useMutationObserver(document.body, { subtree: true, childList: true }, (mutationsList) =>
    mutationsList
      .reduce<HTMLVideoElement[]>((acc, mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);
        const directMatch = addedNodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
        if (directMatch) {
          return [...acc, directMatch];
        }

        const parentMatches = addedNodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);

        return [...acc, ...parentMatches];
      }, [])
      .filter(isValidVideo)
      .forEach((el) => (srcToVideo.value[el.src] = { hasSubtitle: el.classList.contains('plussub'), src: el.src, in: 'HOST' }))
  );

  useMutationObserver(document.body, { subtree: true, childList: true }, (mutationsList) =>
    mutationsList
      .reduce<string[]>((acc, mutation) => {
        const removedNodes = Array.from(mutation.removedNodes);
        const directMatch = removedNodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
        if (directMatch) {
          return [...acc, directMatch.src];
        }

        const parentMatches = removedNodes.reduce<string[]>(
          (acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video')).map(({ src }) => src)] : acc),
          []
        );

        return [...acc, ...parentMatches];
      }, [])
      .forEach((src) => {
        if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) setState({ state: 'NONE' });
        delete srcToVideo.value[src];
      })
  );
};
