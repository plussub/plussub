import { Video, VideoSrc } from '@/video/state/types';
import {
  srcToIFrameSource,
  srcToIFrameVideo,
  srcToHostVideo,
  videosWithSubtitle,
  srcToGlobalVideo
} from '@/video/state/state';
import { RemoveVideoInIFrame, useVideoElementMutationObserver, useWindowMessage, VideosInIFrame } from '@/composables';
import { watch, watchEffect } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';
import { currentSelectedVideoSrc } from "@/navigation/state";

const isValidVideo = (el: HTMLVideoElement): boolean => el.offsetWidth !== 0 && el.offsetHeight !== 0 && el.currentSrc !== '';

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  Object.fromEntries(
    [...document.querySelectorAll('video')]
      .filter((el) => isValidVideo(el))
      .map((el) => [
        el.currentSrc,
        {
          src: el.currentSrc,
          in: 'HOST',
          hasSubtitle: el.classList.contains('plussub'),
          el
        }
      ])
  );

const resetSrcToHostVideo = () => {
  srcToHostVideo.value = findVideosInCurrentTab();
}

export const init = (): void => {
  resetSrcToHostVideo();

  // handle host videos
  // handles also if the source or the src changes
  [...document.querySelectorAll('video')].forEach((el) => el.addEventListener('loadedmetadata', resetSrcToHostVideo));
  // new videos added to the page
  useVideoElementMutationObserver(({ added, removed }) => {
    resetSrcToHostVideo();
    added.forEach((el) => el.addEventListener('loadedmetadata', resetSrcToHostVideo));
    if (removed.some((el) => srcToHostVideo.value[el.currentSrc]?.hasSubtitle)) {
      reset();
    }
  });

  useWindowMessage({
    [VideosInIFrame]: ({ origin, source, data: { videos, frameSrc } }) => {
      videos.forEach((e) => (srcToIFrameSource[e.currentSrc] = { window: source as Window, frameSrc, origin }));
      Object.assign(srcToIFrameVideo.value, Object.fromEntries(videos.map(e => [e.currentSrc, {
        hasSubtitle: e.hasSubtitle,
        src: e.currentSrc,
        in: 'I_FRAME'
      }])));
    }
  });
  useWindowMessage({
    [RemoveVideoInIFrame]: ({ data: { currentSrc, frameSrc } }) => {
      if (srcToIFrameVideo.value[currentSrc]?.hasSubtitle) {
        reset();
      }
      delete srcToIFrameVideo.value[currentSrc];
      delete srcToIFrameSource[frameSrc];
    }
  });

  watch(() => currentSelectedVideoSrc.value, () => {
    const src = currentSelectedVideoSrc.value;
    if(!src){
      return;
    }
    const video = srcToGlobalVideo.value[src];
    if(video){
      removeVttFrom({ video });
      addVttTo({ video, subtitle: window.plusSub_subtitle.value.withOffsetParsed });
    }
  })

  watch(
    () => window.plusSub_subtitle.value.withOffsetParsed,
    (subtitle) =>
      videosWithSubtitle.value.forEach((video) => {
        removeVttFrom({ video });
        addVttTo({ video, subtitle });
      })
  );
};
