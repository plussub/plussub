import { onUnmounted, onMounted } from 'vue';
import { Video } from '@/video/state';
import { StartTranscript, useWindowMessage } from '@/composables/useWindowMessage';

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
    // todo: impl send
    // props.sourceObj[videoInFrameHasSub.value.src].postMessage({plusSubAction: 'startTranscript'}, videoInFrameHasSub.value.origin);
    useWindowMessage({
      [StartTranscript]: ({data: {currentTime}}) => fn({currentTime})
    });
  }
};
