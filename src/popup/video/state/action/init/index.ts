import {Video, VideoSrc} from "@/video/state/types";
import {srcToVideo, srcToSource} from "@/video/state/state";
import {VideoInIFrame, useMutationObserver, useWindowMessage} from "@/composables";
import {isHTMLElement, isHTMLVideoElement} from "@/types";
import {computed, watch} from "vue";
import {addVttTo, removeVttFrom} from "@/video/state";

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
    [VideoInIFrame]: ({ origin, source, data: { src, frameSrc, hasSubtitle } }) => {

      console.warn('vid in iframe incoming to host');
      console.warn(frameSrc);
      console.warn(origin);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      source[frameSrc].postMessage({
        plusSubAction: 'ADD_SUBTITLE',
        someData: 'lolz'
      }, origin);

      if (!srcToVideo.value[src]) {
        srcToSource[src] = source;
        srcToVideo.value[src] = { origin, hasSubtitle, src, frameSrc, in: 'I_FRAME' };
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
