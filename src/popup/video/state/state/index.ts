import { ref } from 'vue';
import { Video, VideoSrc } from '@/video/state';

export const srcToVideo = ref<Record<VideoSrc, Video>>({});

// don't make source(of iframe) reactive as it will cause cors problem
export interface IFrameSource {
  window: Window;
  frameSrc: string;
  origin: string;
}

export const srcToIFrameSource: Record<VideoSrc, IFrameSource> = {};
