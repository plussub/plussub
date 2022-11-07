import { defineStore } from 'pinia'
import { EXTENSION_ORIGIN } from '@/types';
import { ref } from 'vue';

export const useStore = defineStore('close', () => {
  const unmountFn = ref(() => null);
  return {
    unmountFn,
    close(){
      unmountFn.value();
      document.getElementById(`${EXTENSION_ORIGIN}Shadow`)?.remove();
    }
  };
});