<template>
  <div ref="transcriptContentContainer" class="mt-1 overflow-y-auto select-none">
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

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch} from 'vue';
import { useInjectStore } from '@/useInjectStore';
import { binarySearch } from './binarySearch';
import Duration from "luxon/src/duration";

export default defineComponent({
  props: {
    follow: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    }
  },
  setup(props) {
    const subtitleStore = useInjectStore('subtitleStore');
    const videoStore = useInjectStore('videoStore');
    const currentTime = computed(() => parseInt(videoStore.getters.current.value?.lastTimestamp ?? '0', 10));

    const currentPos = ref(-1);
    const transcriptContentContainer = ref<HTMLElement | null>(null);

    watch(currentTime, (currentTime) => {
      const pos = binarySearch(currentTime, subtitleStore.state.value.withOffsetParsed);

      if (pos === -1) return;

      currentPos.value = pos;

      if (props.follow && transcriptContentContainer.value && !transcriptContentContainer.value.matches(':hover')) {
        transcriptContentContainer.value.querySelector<HTMLElement>(`:nth-child(${currentPos.value + 1})`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    });

    return {
      currentPos,
      transcriptContentContainer,
      subtitleTexts: computed(() =>
        subtitleStore.state.value.withOffsetParsed.map(({ from, text }) => ({
          formattedFrom: Duration.fromMillis(from).toFormat('mm:ss'),
          text,
          time: from / 1000
        }))
      ),
      setCurrentTime: ({ time }: { time: number }): void => {
        // +0.001 because the "from" is often the same as previous "to", use this to advoid showing previous subtitle text
        videoStore.actions.setTime({ time: time + 0.001 });
      },
      currentTimePretty: computed(() => Duration.fromMillis(currentTime.value * 1000).toFormat('mm:ss')),
      copy: ({ text }: { text: string }) => navigator.clipboard.writeText(text)
    };
  }
});
</script>
