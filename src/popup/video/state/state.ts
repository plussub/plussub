import { computed, ref, Ref } from 'vue';
import { Video, VideoSrc, IFrameSource} from '@/video/state/types';

export const srcToHostVideo = ref<Record<VideoSrc, Video>>({});
export const srcToIFrameVideo = ref<Record<VideoSrc, Video>>({});

// don't make source(of iframe) reactive as it will cause cors problem
export const srcToIFrameSource: Record<VideoSrc, IFrameSource> = {};

export const srcToGlobalVideo: Ref<Record<VideoSrc, Video>> = computed(() => ({ ...srcToHostVideo.value, ...srcToIFrameVideo.value }));
export const videoList: Ref<Video[]> = computed(() =>  Object.values(srcToGlobalVideo.value));
export const videosWithSubtitle = computed(() => videoList.value.filter((e) => e.hasSubtitle));
export const videoCount = computed(() => videoList.value.length);
