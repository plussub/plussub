import { defineStore } from 'pinia';
import { windowStorage } from '@/windowStorage';
import { SubtitleFormat } from '@/subtitle/store';
import { ref } from 'vue';

export const useStore = defineStore('file', () => {
    const filename = ref('');
    return {
      filename,
      reset() {
        filename.value = '';
      },
      getFormatFromFilename: (filename: string): SubtitleFormat | null => {
        switch (true) {
          case /\.(ass)$/.test(filename):
            return '.ass';
          case /\.(ssa)$/.test(filename):
            return '.ssa';
          case /\.(vtt)$/.test(filename):
            return '.vtt';
          case /\.(srt)$/.test(filename):
            return '.srt';
          default:
            return null;
        }
      }
    };
  },
  {
    persist: {
      key: 'file',
      storage: windowStorage
    }
  });