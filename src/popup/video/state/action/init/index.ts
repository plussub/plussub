import { Video, VideoSrc } from '@/video/state/types';
import { srcToIFrameSource, srcToVideo } from '@/video/state/state';
import { RemoveVideoInIFrame, useVideoElementMutationObserver, useWindowMessage, VideoInIFrame } from '@/composables';
import { computed, watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';
import { isValidVideo } from '@/video/state/action/isValidVideo';

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .filter((el) => isValidVideo({ videoIn: 'HOST', el }))
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
  useWindowMessage({
    [RemoveVideoInIFrame]: ({ data: { src } }) => {
      if (srcToVideo.value[src]) {
        if (srcToVideo.value[src].hasSubtitle) {
          reset();
        }
        delete srcToVideo.value[src];
        delete srcToIFrameSource[src];
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

  // todo video element observer
  watch(
    () => srcToVideo.value,
    () => {}
  );

  useVideoElementMutationObserver(({ added, removed }) => {
    added.forEach((el) => {
      srcToVideo.value[el.src] = {
        el,
        hasSubtitle: el.classList.contains('plussub'),
        src: el.src,
        in: 'HOST'
      };
    });
    removed.forEach((el) => {
      if (srcToVideo.value[el.src] && srcToVideo.value[el.src].hasSubtitle) {
        reset();
      }
      delete srcToVideo.value[el.src];
    });
  });
};
