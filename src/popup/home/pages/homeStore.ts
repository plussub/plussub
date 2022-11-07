import { defineStore } from 'pinia';
import { useStore as useVideoStore, Video } from '@/video/store';
import { useStore as useFileStore } from '@/file/store';
import { useStore as useSubtitleStore } from '@/subtitle/store';
import { useStore as useSearchStore } from '@/search/store';
import { useStore as useAppStore } from '@/app/store';
import { computed } from 'vue';

export const useStore = defineStore('homeStore', () => {
  return {
    async removeResult() {
      const videoStore = useVideoStore();

      await videoStore.removeCurrent();
      useAppStore().reset();
      useFileStore().reset();
      useSearchStore().reset();
      useSubtitleStore().reset();
      videoStore.removeHighlight();
    },
    async setCurrentVideo({ video }: { video: Video }) {
      await useVideoStore().setCurrent({ video });
    },
    highlightCurrentVideo() {
      useVideoStore().highlightCurrent();
    },
    highlightVideo({ video }: { video: Video }) {
      useVideoStore().highlight({ video });
    },
    removeHighlightFromVideo() {
      useVideoStore().removeHighlight()
    },

    loading: computed(() => useAppStore().state !== 'DONE'),
    error: computed(() => useAppStore().state === 'ERROR'),
    tmbdResult: computed(() => useSearchStore().tmdb),
    openSubtitleResult: computed(() => useSearchStore().openSubtitle),
    tmdbLink: computed(() => useSearchStore().tmdbLink),
    releaseYear: computed(() => useSearchStore().releaseYear),
    currentTimeAs: computed(() => {
      return (fmt) => useVideoStore().currentTimeAs(fmt).value
    }),
    filenameResult: computed(() => useFileStore().filename),
    videoList: computed(() => useVideoStore().list)
  };
});