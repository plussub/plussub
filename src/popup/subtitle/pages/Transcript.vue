<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back>
    <template #toolbar>
      <a class="self-center pr-4" :title="infoTooltip">
        <fa icon="question-circle" class="h-icon hover:text-on-primary-hover-500"></fa>
      </a>
    </template>
    <template #content>
      <div class="w-full h-full grid relative justify-center transcript-content--container">
        <div style="grid-area: bar" class="pt-3 pb-2 bg-primary-50 flex justify-end">
          <span class="px-4 font-medium">{{ currentTimePretty }}</span>
        </div>
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar class="w-full" />
        </div>
        <TranscriptContent style="grid-area: entries"></TranscriptContent>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import Duration from 'luxon/src/duration.js';

import PageLayout from '@/components/PageLayout.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import TranscriptContent from '@/subtitle/components/TranscriptContent.vue';
import { useInjectStore } from '@/composables/useInjectStore';

export default defineComponent({
  components: {
    PageLayout,
    LoadingBar,
    TranscriptContent
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const videoStore = useInjectStore('videoStore');
    const currentTime = ref<number>(0);

    videoStore.actions.useTimeUpdate(({ time }): void => {
      currentTime.value = time;
    });

    return {
      currentTimePretty: computed(() => Duration.fromMillis(currentTime.value * 1000).toFormat('mm:ss')),
      infoTooltip: computed(() => [`left click - jump to time point`, `shift + left click - copy text to clipboard`].join('\n'))
    };
  }
});
</script>

<style scoped>
.transcript-content--container {
  min-height: 300px;
  max-height: 500px;
  grid-template-areas:
    'bar'
    'loading'
    'entries';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>
