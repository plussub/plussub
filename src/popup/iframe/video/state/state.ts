import { computed, ref, Ref } from 'vue';
import { Video, VideoSrc} from '@/iframe/video/state/types';

export const srcToVideo = ref<Record<VideoSrc, Video>>({});

export const videoList: Ref<Video[]> = computed(() =>  Object.values(srcToVideo.value));
export const videosWithSubtitle = computed(() => videoList.value.filter((e) => e.hasSubtitle));
export const videoCount = computed(() => videoList.value.length);
