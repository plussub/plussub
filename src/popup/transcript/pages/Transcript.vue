<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back>
    <template #content>
      <div ref="transcriptContentContainer" class="h-full w-full relative overflow-scroll select-none">
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
    </template>
  </PageLayout>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch} from 'vue';
import {setCurrentTime as setCurrentTimeState, videoList} from '@/video/state';
import {subtitleState} from '@/subtitle/state';
import Duration from 'luxon/src/duration.js';
import {useTimeUpdate} from '@/video/composable';

import {default as PageLayout} from '@/components/PageLayout.vue';
import {binarySearch} from '@/transcript/pages/binarySearch';

export default defineComponent({
  components: {
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
    const currentTime = ref<number>(0);
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));

    if (video.value) {
      useTimeUpdate({
        video: video.value,
        fn: ({currentTime: currentTimeFromVideo}): void => {
          currentTime.value = currentTimeFromVideo;
        }
      });
    }

    const currentPos = ref(-1);
    const transcriptContentContainer = ref<HTMLElement | null>(null);

    watch(currentTime, (currentTime) => {
      const pos = binarySearch(Math.ceil(currentTime * 1000), subtitleState.value.withOffsetParsed);
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
          subtitleState.value.withOffsetParsed.map(({from, text}) => ({
            formattedFrom: Duration.fromMillis(from).toFormat('mm:ss'),
            text,
            time: from / 1000
          }))
      ),
      setCurrentTime: ({time}: { time: number }): void => {
        if (!video.value) {
          return;
        }
        // +0.001 because the "from" is often the same as previous "to", use this to advoid showing previous subtitle text
        setCurrentTimeState({
          video: video.value,
          time: time + 0.001
        });
      },
      copy: ({text}: { text: string }) => navigator.clipboard.writeText(text)
    };
  }
});
</script>
