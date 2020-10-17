import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { useMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { setState } from '@/app/state';

export const isValidVideo = (el: HTMLVideoElement, src: string, videoIn: 'I_FRAME' | 'HOST'): boolean => {
  if (!(el.offsetWidth && el.offsetHeight)) return false;
  if (!el.src && !el.querySelector('source')) {
    // for cases that it does not have src first, but will add src after the video is playing. (eg. vimeo.com)
    useMutationObserver(el, { attributes: true, childList: true }, (mutationsList) => {
      for (const mutation of mutationsList) {
        console.log(mutation);
        if ((mutation.attributeName === 'src' || (mutation.addedNodes.length > 0 && isHTMLElement(mutation.addedNodes[0]) && mutation.addedNodes[0].tagName === 'source')) && !srcToVideo.value[src]) {
          srcToVideo.value[src] = { hasSubtitle: el.classList.contains('plussub'), src, in: videoIn };
        }
      }
    });
    return false;
  }
  return true;
};

// TODO: it seems that this does not work with video in Iframe
export const initMutationObserver = (videoIn: 'I_FRAME' | 'HOST', iFrameSrc = ''): void => {
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
      .filter((el: HTMLVideoElement) => isValidVideo(el, videoIn === 'HOST' ? el.src : iFrameSrc, videoIn))
      .forEach((el) => {
        const src = videoIn === 'HOST' ? el.src : iFrameSrc;
        srcToVideo.value[src] = { hasSubtitle: el.classList.contains('plussub'), src: src, in: videoIn };
      })
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
      .forEach((srcOfElement) => {
        const src = videoIn === 'HOST' ? srcOfElement : iFrameSrc;
        if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) setState({ state: 'NONE' });
        delete srcToVideo.value[src];
      })
  );
};

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .filter((el: HTMLVideoElement) => isValidVideo(el, el.src, 'HOST'))
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
  initMutationObserver('HOST');
};
