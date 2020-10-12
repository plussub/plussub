import {ref} from "vue";
import {Video, VideoSrc} from "@/video/state";

export const srcToVideo = ref<Record<VideoSrc, Video>>({});
// don't make source(of iframe) reactive as it may cause cors problem
export const srcToSource: Record<VideoSrc, MessageEvent['source']> = {};
