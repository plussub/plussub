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
          <div style="grid-column: 2 / 3">{{ preferredLanguage }}</div>
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
import { computed, defineComponent, PropType } from 'vue';
import { clear as storageClear } from 'storage';

import PageLayout from '@/components/PageLayout.vue';
import { useInjectStore } from '@/composables/useInjectStore';
import Toolbar from '@/Toolbar/Toolbar.vue';

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
    const searchStore = useInjectStore('searchStore');
    const navigationStore = useInjectStore('navigationStore');
    const videoStore = useInjectStore('videoStore');

    return {
      preferredLanguage: computed(() => searchStore.state.value.preferredLanguage),
      clearUserData: async () => {
        await storageClear();
        searchStore.actions.setPreferredLanguage({ preferredLanguage: 'en' });
      },
      backFn: () => (videoStore.getters.count.value === 1 ? navigationStore.actions.toMovieTvSearch() : navigationStore.actions.toHome())
    };
  }
});
</script>
