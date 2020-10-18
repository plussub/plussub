import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { useMutationObserver, useElementMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { isHTMLElement, isHTMLVideoElement } from '@/types';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';

// TODO: change video name when change
// race competition on all these mutatinobserver
const changeSrc = (el: HTMLVideoElement, oldSrc: string) => {
  if (srcToVideo.value[oldSrc] && srcToVideo.value[oldSrc].hasSubtitle) reset();
  delete srcToVideo.value[oldSrc];
  const { src } = el;
  srcToVideo.value[src] = { el, hasSubtitle: el.classList.contains('plussub'), src, in: 'HOST' };
};

const isValidVideo = (el: HTMLVideoElement): boolean => {
  if (!(el.offsetWidth && el.offsetHeight)) return false;
  let inVideoList = false;
  let oldSrc = '';
  if (!el.src && !el.querySelector('source')) {
    // (warning when use with onMount or onUnmount): onMount(onUnmount) is called when there is no active component instance to be associated with.
    // for cases that it does not have src first, but will add src after the video is playing. (eg. vimeo.com)
    useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
      const { src } = el;
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'src') {
          if (inVideoList && src) {
            // TODO: fix bug that sometimes cannot work unless unopen popup window or reupload subtitle
            changeSrc(el, oldSrc);
            oldSrc = src;
          }
          if (!inVideoList && !srcToVideo.value[src]) {
            inVideoList = true;
            oldSrc = src;
            srcToVideo.value[src] = { el, hasSubtitle: el.classList.contains('plussub'), src, in: 'HOST' };
          }
        }
      }
    });
    return false;
  }
  oldSrc = el.src;
  // for cases that the src of video changes (eg. when change video in vimeo.com or bilibil.com)
  useElementMutationObserver(el, { attributes: true }, (mutationsList) => {
    const { src } = el;
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'src' && src) {
        changeSrc(el, oldSrc);
        oldSrc = src;
      }
    }
  });
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

  const findVideoElement = (nodes: Node[]) => {
    const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
    if (directMatch) return [directMatch];

    return nodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);
  };
  useMutationObserver((mutationsList) =>
    mutationsList.forEach((mutation) => {
      findVideoElement(Array.from(mutation.removedNodes)).forEach((el) => {
        const { src } = el;
        if (!srcToVideo.value[src]) return;
        if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) reset();
        delete srcToVideo.value[src];
      });
      findVideoElement(Array.from(mutation.addedNodes)).forEach((el) => {
        if (!isValidVideo(el)) return;
        srcToVideo.value[el.src] = { el, hasSubtitle: el.classList.contains('plussub'), src: el.src, in: 'HOST' };
      });
    })
  );
};
