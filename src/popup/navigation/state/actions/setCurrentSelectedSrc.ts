import { VideoSrc } from '@/video/state';

export const setCurrentSelectedSrc = (src: VideoSrc | null): void => {
  window.plusSub_currentSelectedSrc.value = src;
};
