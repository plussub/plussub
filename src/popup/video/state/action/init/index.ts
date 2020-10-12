import {Video, VideoSrc} from "@/video/state/types";
import {srcToVideo, srcToSource} from "@/video/state/state";
import {SendIFrame, useMutationObserver, useWindowMessage} from "@/composables";
import {isHTMLElement, isHTMLVideoElement} from "@/types";

const findVideosInCurrentTab = (): Record<VideoSrc, Video> => [...document.querySelectorAll('video')]
  .map((el) => ({
    origin: window.origin,
    frameSrc: window.location.href,
    src: el.src,
    in: 'HOST',
    hasSubtitle: el.classList.contains('plussub'),
    el
  }))
  .reduce((acc, cur) => ({ ...acc, [cur.src]: cur }), {});

export const init = (): void => {
  srcToVideo.value = findVideosInCurrentTab();
  useWindowMessage({
    [SendIFrame]: ({ origin, source, data: { src, frameSrc, hasSubtitle } }) => {
      if (!srcToVideo.value[src]) {
        srcToSource[src] = source;
        srcToVideo.value[src] = { origin, hasSubtitle, src, frameSrc, in: 'I_FRAME' };
      }
    }
  });

// sometimes the element in video tag is a advertisement, delete in video list if advertisement if removed
  useMutationObserver((mutationsList) =>
    mutationsList
      .reduce<string[]>((acc, mutation) => {
        const nodes = Array.from(mutation.removedNodes);
        const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
        if (directMatch) {
          return [...acc, directMatch.src];
        }

        const parentMatches = nodes.reduce<string[]>(
          (acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video')).map(({ src }) => src)] : acc),
          []
        );

        return [...acc, ...parentMatches];
      }, [])
      .forEach((src) => delete srcToVideo.value[src])
  );
}
