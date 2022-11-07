<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar has-back :back-fn="backFn"></Toolbar>
    </template>
    <template #content>
      <div class="pt-2 px-2">
        <div class="font-header font-medium text-xl">User data</div>
        <div style="grid-area: detail; grid-template-columns: auto 1fr; grid-column-gap: 16px" class="grid w-full leading-relaxed">
          <div style="grid-column: 1 / 2" class="font-medium">Preferred language</div>
          <div style="grid-column: 2 / 3">{{ languageStore.preferredContentLanguage.language_name }}({{ languageStore.preferredContentLanguage.language_code }})</div>
        </div>
        <div class="flex w-full justify-end px-4">
          <a class="text-primary-500 hover:text-primary-700" @click="clearUserData">
            <span class="pr-1"> Reset </span>
          </a>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { clear as storageClear } from 'storage';

import PageLayout from '@/components/PageLayout.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useLanguageStore } from '@/language/store';
import { useStore as useVideoStore } from '@/video/store';

export default defineComponent({
  components: {
    Toolbar,
    PageLayout
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const languageStore = useLanguageStore();
    const navigationStore = useNavigationStore();
    const videoStore = useVideoStore();

    return {
      languageStore,
      clearUserData: async () => {
        await storageClear();
        await languageStore.resetPreferredContentLanguageToDefault();
      },
      backFn: () => (videoStore.count === 1 ?
        navigationStore.to("MOVIE-TV-SEARCH", {contentTransitionName: 'content-navigate-shallow'}) :
        navigationStore.to("HOME", {contentTransitionName: 'content-navigate-shallow'}))
    };
  }
});
</script>
