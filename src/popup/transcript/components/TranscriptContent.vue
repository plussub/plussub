<template>
  <div ref="transcriptContentContainer" class="mt-1 overflow-y-auto select-none">
    <div
      v-for="(entry, index) in entries"
      :key="index"
      class="flex px-1 pt-4 pb-1 border-primary-700 cursor-pointer hover:bg-primary-700 hover:text-on-primary-700 hover:border-primary-900"
      :class="{ 'bg-surface-100': position === index, 'border-l-4': position === index }"
      @click.exact="$emit('jump', entry)"
      @click.shift.prevent="$emit('copy', entry)"
    >
      <slot name="line" :entry='entry'></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch} from 'vue';
import { SubtitleEntry } from '@/subtitle/store';

export default defineComponent({
  props: {
    follow: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    entries :{
      type: Array as PropType<SubtitleEntry[]>,
      default: () => []
    },
    position: {
      type: Number as PropType<number>,
      required: false,
      default: -1
    },
  },
  emits: ['jump', 'copy'],
  setup(props) {
    const transcriptContentContainer = ref<HTMLElement | null>(null);

    watch(computed(() => props.position), (position) => {
      if (props.follow && transcriptContentContainer.value && !transcriptContentContainer.value.matches(':hover')) {
        transcriptContentContainer.value.querySelector<HTMLElement>(`:nth-child(${position + 1})`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    });

    return {
      transcriptContentContainer
    };
  }
});
</script>
