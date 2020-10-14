import { onUnmounted, onMounted } from 'vue';
import {srcToIFrameSource, Video} from '@/video/state';
import {
  postWindowMessage,
  StartTranscript, StopTranscript,
  useWindowMessage,
  VideoCurrentTime
} from '@/composables/useWindowMessage';

export interface FnPayload {
  currentTime: number;
}

export interface Payload {
  video: Video;
  fn: (event: FnPayload) => void;
}

export const useTimeUpdate = ({ video, fn }: Payload): void => {
  if (video.in === 'HOST') {
    const handler = () => fn({ currentTime: video.el?.currentTime ?? 0 });
    onMounted(() => video.el?.addEventListener('timeupdate', handler));
    onUnmounted(() => video.el?.removeEventListener('timeupdate', handler));
  } else {
    onMounted(() => {
      const iFrameSource = srcToIFrameSource[video.src];
      if(!iFrameSource){
        return;
      }
      // props.sourceObj[videoInFrameHasSub.value.src].postMessage({plusSubAction: 'startTranscript'}, videoInFrameHasSub.value.origin);
      useWindowMessage({
        [VideoCurrentTime]: ({ data: { currentTime } }) => {
          console.warn(currentTime);
          fn({ currentTime });
        }
      });
      postWindowMessage({
        window: iFrameSource.window,
        origin: iFrameSource.origin,
        payload: {
          plusSubAction: StartTranscript
        }
      });
    });
    onUnmounted(() => {
      const iFrameSource = srcToIFrameSource[video.src];
      if(!iFrameSource){
        return;
      }
      postWindowMessage({
        window: iFrameSource.window,
        origin: iFrameSource.origin,
        payload: {
          plusSubAction: StopTranscript
        }
      });
    });
  }
};
