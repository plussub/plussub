import { onUnmounted, onMounted } from 'vue';

export interface Payload {
  video: HTMLVideoElement;
  fn: (ev: Event) => void;
}

export const useTimeUpdate = ({ video, fn }: Payload): void => {
  onMounted(() => video.addEventListener('timeupdate', fn));
  onUnmounted(() => video.removeEventListener('timeupdate', fn));
};
