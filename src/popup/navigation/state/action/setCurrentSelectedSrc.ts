import { currentSelectedVideoSrc } from '@/navigation/state/state';
import { VideoSrc } from '@/video/state';

export const setCurrentSelectedSrc = (src: VideoSrc | null): void => {
  currentSelectedVideoSrc.value = src;
};
