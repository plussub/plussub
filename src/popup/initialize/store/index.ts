import { defineStore } from 'pinia';
import { useStore as useLanguageStore } from '@/language/store';
import { useStore as useContentScriptStore } from '@/contentScript/store';
import { useStore as useAppearanceStore } from '@/appearance/store';
import { useStore as useVideoStore } from '@/video/store';

export const useStore = defineStore('initialized', {
  actions: {
    async initialize() {
      await useContentScriptStore().initialize();
      await useLanguageStore().initialize();
      await useAppearanceStore().initialize();
      await useVideoStore().initialize();
    },
    async unmount() {
      await useContentScriptStore().unmount();
      await useAppearanceStore().unmount();
      await useVideoStore().initialize();
    }
  },
  getters: {
    initialized: () => useLanguageStore().initialized
  }
})