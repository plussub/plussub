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
        <div class="overflow-y-auto select-none" style="grid-area: entries">
          <div
            v-for="(subtitleText, index) in subtitleTexts"
            :key="index"
            class="flex px-1 pt-4 pb-1 border-primary-700 cursor-pointer hover:bg-primary-700 hover:text-on-primary-700 hover:border-primary-900"
            :class="{ 'bg-surface-100': currentPos === index, 'border-l-4': currentPos === index }"
            @click.exact="setCurrentTime(subtitleText)"
            @click.shift.prevent="copy(subtitleText)"
          >
            <span class="text-center flex-shrink-0 w-14" v-text="subtitleText.formattedFrom"></span>
            <span class="text-left" v-text="subtitleText.text"></span>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType, ref, watch } from 'vue';
import { setCurrentTime as setCurrentTimeState, videoList } from '@/video/state';
import { SubtitleStore } from '@/subtitle/store';
import Duration from 'luxon/src/duration.js';
import { useTimeUpdate } from '@/video/composable';

import PageLayout from '@/components/PageLayout.vue';
import { binarySearch } from './binarySearch';
import LoadingBar from '@/components/LoadingBar.vue';

export default defineComponent({
  components: {
    PageLayout,
    LoadingBar
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const subtitleStore = inject<SubtitleStore>('subtitleStore');
    if (!subtitleStore) {
      throw new Error('inject failed');
    }

    const currentTime = ref<number>(0);
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));

    useTimeUpdate({
      video,
      fn: ({ currentTime: currentTimeFromVideo }): void => {
        currentTime.value = currentTimeFromVideo;
      }
    });

    const currentPos = ref(-1);
    const transcriptContentContainer = ref<HTMLElement | null>(null);

    watch(currentTime, (currentTime) => {
      const pos = binarySearch(Math.ceil(currentTime * 1000), subtitleStore.state.value.withOffsetParsed);
      if (pos === -1) return;
      currentPos.value = pos;
      if (transcriptContentContainer.value && !transcriptContentContainer.value.matches(':hover')) {
        const topPos = Math.max(currentPos.value - 3, 0);
        const topElement = transcriptContentContainer.value.querySelector<HTMLElement>(`:nth-child(${topPos + 1})`);
        if (!topElement) return;
        transcriptContentContainer.value.scrollTop = topElement.offsetTop;
      }
    });

    return {
      currentPos,
      transcriptContentContainer,
      video,
      subtitleTexts: computed(() =>
        subtitleStore.state.value.withOffsetParsed.map(({ from, text }) => ({
          formattedFrom: Duration.fromMillis(from).toFormat('mm:ss'),
          text,
          time: from / 1000
        }))
      ),
      setCurrentTime: ({ time }: { time: number }): void => {
        if (!video.value) {
          return;
        }
        // +0.001 because the "from" is often the same as previous "to", use this to advoid showing previous subtitle text
        setCurrentTimeState({
          video: video.value,
          time: time + 0.001
        });
      },
      currentTimePretty: computed(() => Duration.fromMillis(currentTime.value * 1000).toFormat('mm:ss')),
      infoTooltip: computed(() => [`left click - jump to time point`, `shift + left click - copy text to clipboard`].join('\n')),
      copy: ({ text }: { text: string }) => navigator.clipboard.writeText(text)
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
