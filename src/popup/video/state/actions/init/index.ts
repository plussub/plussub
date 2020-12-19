import { Video, VideoSrc } from '@/video/state/types';
import { srcToGlobalVideo, srcToHostVideo, srcToIFrameSource, srcToIFrameVideo, videosWithSubtitle } from '@/video/state/state';
import { RemoveVideoInIFrame, useVideoElementMutationObserver, useWindowMessage, VideosInIFrame } from '@/composables';
import { watch } from 'vue';
import { addVttTo, removeVttFrom } from '@/video/state';
import { reset } from '@/app/state';
import { currentSelectedVideoSrc } from '@/navigation/state';
import { removeUrlHash } from '@/util/url';

const isValidVideo = (el: HTMLVideoElement): boolean => el.offsetWidth !== 0 && el.offsetHeight !== 0 && el.currentSrc !== '';

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  Object.fromEntries(
    [...document.querySelectorAll('video')]
      .filter((el) => isValidVideo(el))
      .map((el) => [
        removeUrlHash(el.currentSrc),
        {
          src: removeUrlHash(el.currentSrc),
          in: 'HOST',
          hasSubtitle: el.classList.contains('plussub'),
          el
        }
      ])
  );

const resetSrcToHostVideo = () => {
  srcToHostVideo.value = findVideosInCurrentTab();
};

export const init = (): void => {
  resetSrcToHostVideo();

  // handle host videos
  // handles also if the source or the src changes
  [...document.querySelectorAll('video')].forEach((el) => el.addEventListener('loadedmetadata', resetSrcToHostVideo));
  // new videos added to the page
  useVideoElementMutationObserver(({ added, removed }) => {
    resetSrcToHostVideo();
    added.forEach((el) => el.addEventListener('loadedmetadata', resetSrcToHostVideo));
    if (removed.some((el) => srcToHostVideo.value[removeUrlHash(el.currentSrc)]?.hasSubtitle)) {
      reset();
    }
  });

  useWindowMessage({
    [VideosInIFrame]: ({ origin, source, data: { videos, frameSrc } }) => {
      videos.forEach(
        (e) =>
          (srcToIFrameSource[removeUrlHash(e.currentSrc)] = {
            window: source as Window,
            frameSrc,
            origin
          })
      );
      Object.assign(
        srcToIFrameVideo.value,
        Object.fromEntries(
          videos.map((e) => [
            removeUrlHash(e.currentSrc),
            {
              hasSubtitle: e.hasSubtitle,
              src: removeUrlHash(e.currentSrc),
              in: 'I_FRAME'
            }
          ])
        )
      );
    }
  });
  useWindowMessage({
    [RemoveVideoInIFrame]: ({ data: { currentSrc, frameSrc } }) => {
      currentSrc = removeUrlHash(currentSrc);
      if (srcToIFrameVideo.value[currentSrc]?.hasSubtitle) {
        reset();
      }
      delete srcToIFrameVideo.value[currentSrc];
      delete srcToIFrameSource[frameSrc];
    }
  });

  watch(
    () => currentSelectedVideoSrc.value,
    (src, prevSrc) => {
      if (prevSrc && srcToGlobalVideo.value[prevSrc]) {
        removeVttFrom({ video: srcToGlobalVideo.value[prevSrc] });
      }
    }
  );

  watch(
    () => window.plusSub_subtitle.value.withOffsetParsed,
    (subtitles) => {
      if (!currentSelectedVideoSrc.value) {
        console.warn('current selected is null');
        return;
      }
      const video = srcToGlobalVideo.value[currentSelectedVideoSrc.value];
      const subtitleId = window.plusSub_subtitle.value.id;
      if (!subtitleId) {
        console.warn('subtitleId is null');
        return;
      }
      addVttTo({ video, subtitles, subtitleId });
    }
  );
};
