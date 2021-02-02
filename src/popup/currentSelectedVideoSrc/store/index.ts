import { computed, ComputedRef, Ref, ref } from 'vue';
import { VideoSrc } from '@/video/state';

export type CurrentSelectedVideoSrcState = VideoSrc | null;

export interface CurrentSelectedVideoSrcStore {
  state: ComputedRef<CurrentSelectedVideoSrcState>;
  actions: {
    setCurrent: (src: VideoSrc) => void;
    reset: () => void;
  };
}

declare global {
  interface Window {
    plusSub_currentSelectedSrc: Ref<CurrentSelectedVideoSrcState>;
  }
}

export const init = (): CurrentSelectedVideoSrcStore => {
  window.plusSub_currentSelectedSrc = window.plusSub_currentSelectedSrc ? ref(window.plusSub_currentSelectedSrc.value) : ref<CurrentSelectedVideoSrcState>(null);

  return {
    state: computed(() => window.plusSub_currentSelectedSrc.value),
    actions: {
      setCurrent: (src: VideoSrc) => {
        window.plusSub_currentSelectedSrc.value = src;
      },
      reset: () => {
        window.plusSub_currentSelectedSrc.value = null;
      }
    }
  };
};
