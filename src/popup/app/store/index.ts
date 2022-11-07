import { defineStore } from 'pinia';
import { windowStorage } from '@/windowStorage';
import { ref } from 'vue';

export const useStore = defineStore('app', () => {
    const state = ref<'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'ERROR' | 'DONE'>('NONE');
    const src = ref<'NONE' | 'FILE' | 'SEARCH'>('NONE');
    return {
      state,
      src,
      reset: () => {
        state.value = 'NONE';
        src.value = 'NONE';
      }
    };
  },
  {
    persist: {
      key: 'app',
      storage: windowStorage
    }
  }
);

