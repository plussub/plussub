import { defineStore } from 'pinia';
import { SubtitleEntry, useStore as useSubtitleStore } from '@/subtitle/store';
import { useStore as useVideoStore } from '@/video/store';
import { findNext } from '@/subtitle/tab/findNext';
import { Duration } from 'luxon';
import { computed } from 'vue';

export const useStore = defineStore('transcript', () => {
  const entries = computed(() => useSubtitleStore().withOffsetParsed);
  const currentTime = computed(() => useVideoStore().currentTime);

  return {
    jump(entry: SubtitleEntry) {
      useVideoStore().setTime({ time: (entry.from / 1000) + 0.001 });
    },
    copy(entry: SubtitleEntry) {
      navigator.clipboard.writeText(entry.text);
    },
    formatTime: computed(() => {
      return (ms) => Duration.fromMillis(ms).toFormat('mm:ss');
    }),
    entries,
    currentTime,
    currentSubtitlePos: computed(() => findNext(currentTime.value, entries.value))
  };
});