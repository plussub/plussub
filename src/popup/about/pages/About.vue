<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar has-back :back-fn="backFn"></Toolbar>
    </template>
    <template #content>
      <div class="w-full">
        <div class="flex relative pl-4 py-4 bg-primary-50 shadow-md font-medium text-xl">
          <div>About</div>
        </div>
        <div style="grid-template-columns: auto 1fr; grid-column-gap: 16px" class="grid w-full leading-relaxed px-4 pt-4">
          <div style="grid-column: 1 / 2" class="font-medium">Whats new</div>
          <div style="grid-column: 2 / 3">nothing</div>
        </div>
        <div style="grid-template-columns: auto 1fr; grid-column-gap: 16px" class="grid w-full leading-relaxed px-4 pt-4">
          <div style="grid-column: 1 / 2" class="font-medium">Powered by</div>
          <div style="grid-column: 2 / 3">nothing</div>
        </div>
        <Mention class='mt-8'/>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useVideoStore } from '@/video/store';
import Mention from '@/home/components/Mention.vue';

export default defineComponent({
  components: {
    Toolbar,
    PageLayout,
    Mention
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const navigationStore = useNavigationStore();
    const videoStore = useVideoStore();

    return {
      backFn: () => (videoStore.count === 1 ?
        navigationStore.to("MOVIE-TV-SEARCH", {contentTransitionName: 'content-navigate-shallow'}) :
        navigationStore.to("HOME", {contentTransitionName: 'content-navigate-shallow'}))
    };
  }
});
</script>
