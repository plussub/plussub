import { ref } from 'vue';
import { Video, VideoSrc } from '@/iframe/video/state/types';

export const srcToVideo = ref<Record<VideoSrc, Video>>({});
