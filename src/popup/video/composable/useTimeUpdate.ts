import { onUnmounted, Ref, watch } from 'vue';
import { Video, srcToIFrameSource } from '@/video/store';
import { postWindowMessage, StartTranscript, StopTranscript, useWindowMessage, VideoCurrentTime } from '@/composables/useWindowMessage';

export interface FnPayload {
  currentTime: number;
}

export interface Payload {
  video: Ref<Video | undefined>;
  fn: (event: FnPayload) => void;
}

export const useTimeUpdate = ({ video, fn }: Payload): void => {
  const handler = () => fn({ currentTime: video.value?.el?.currentTime ?? 0 });

  const removeListenerInHost = (video: Video) => video.el?.removeEventListener('timeupdate', handler);
  const removeListenerInIFrame = (video: Video) => {
    if (!video.src) {
      return;
    }
    const iFrameSource = srcToIFrameSource[video.src];
    if (!iFrameSource) {
      return;
    }
    postWindowMessage({
      window: iFrameSource.window,
      origin: iFrameSource.origin,
      payload: {
        plusSubAction: StopTranscript,
        src: video.src
      }
    });
  };
  onUnmounted(() => (video.value ? removeListenerInHost(video.value) : null));
  onUnmounted(() => (video.value ? removeListenerInIFrame(video.value) : null));

  useWindowMessage({
    [VideoCurrentTime]: ({ data: { currentTime } }) => fn({ currentTime })
  });

  watch(
    () => video.value,
    (currentVideo, previousVideo) => {
      if (previousVideo) {
        removeListenerInHost(previousVideo);
        removeListenerInIFrame(previousVideo);
      }
      if (!currentVideo) {
        return;
      }
      currentVideo.el?.addEventListener('timeupdate', handler);

      if (currentVideo.in === 'HOST') {
        currentVideo.el?.addEventListener('timeupdate', handler);
      } else {
        const iFrameSource = srcToIFrameSource[currentVideo.src];
        if (!iFrameSource) {
          return;
        }
        // todo: fix correct, race condition with mount and unmount between components
        setTimeout(() => {
          postWindowMessage({
            window: iFrameSource.window,
            origin: iFrameSource.origin,
            payload: {
              plusSubAction: StartTranscript,
              src: currentVideo.src
            }
          });
        })
      }
    },
    { immediate: true }
  );
};
