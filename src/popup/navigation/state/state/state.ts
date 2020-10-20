import {ref} from "vue";
import {NavigationState} from "@/navigation/state/types";
import {VideoSrc} from "@/video/state";

export const navigationState = ref<NavigationState>({ name: 'HOME', params: {}});
export const currentSelectedVideoSrc = ref<VideoSrc|null>(null);
