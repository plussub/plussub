<template>
      <fa icon="clock" class="h-icon-sm mr-2" />
      <span class="mr-2">Time</span> <span style="font-family: var(--sl-font-mono)">{{ currentTime }}</span>

      <fa icon="palette" class="h-icon-sm mr-2" />
      Style


      <fa icon="question-circle" class="h-icon-sm mr-2" />
      Info

      <div class="grid offset-time--container">
        <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">
          <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>
          <RangeInputField v-model="offsetTime" step="100" min="-3000" max="3000" class="mr-6 w-1/3 flex-grow" />
          <NumberInputField v-model="offsetTime" step="100" type="number" class="pr-2 w-1/2" />
        </div>
        <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">
          <span class="flex-grow">Preview (next 3 subtitles)</span>
          <label for="excerpt" class="pr-1">Excerpt</label>
          <input id="excerpt" v-model="previewSelection" type="radio" value="excerpt" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
          <label for="diagram" class="pr-1">Diagram</label>
          <input id="diagram" v-model="previewSelection" type="radio" value="diagram" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
        </div>
        <Excerpt v-if="previewSelection === 'excerpt'" style="grid-area: preview; height: 150px; width: calc(100% - 12px)" />
        <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" class="mt-5" />
      </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { computed } from '@vue/reactivity';
import Timeline from './Timeline.vue';
import Excerpt from './Excerpt.vue';
import NumberInputField from '@/components/NumberInputField.vue';
import { VideoStore } from '@/video/store';
import Duration from 'luxon/src/duration';
import { SubtitleStore } from '@/subtitle/store';
import RangeInputField from '@/components/RangeInputField.vue';
import RadioPair from '@/components/RadioPair.vue';
export default defineComponent({
  components: {
    RadioPair,
    RangeInputField,
    Excerpt,
    Timeline,
    NumberInputField
  },
  setup() {
    const subtitleStore = inject<SubtitleStore>('subtitleStore');
    const videoStore = inject<VideoStore>('videoStore');
    const picker = ref<HTMLInputElement | null>(null);
    if (!subtitleStore || !videoStore) {
      throw new Error('inject failed');
    }
    const currentTime = ref<string>(Duration.fromMillis(0).toFormat('hh:mm:ss'));
    videoStore.actions.useTimeUpdate(({ time }): void => {
      currentTime.value = Duration.fromMillis(time * 1000).toFormat('hh:mm:ss');
    });
    const offsetTime = computed({
      get: () => subtitleStore.state.value.offsetTime,
      set: (val) => {
        if (val === undefined) {
          return;
        }
        const offsetTime = parseInt(val.toString());
        subtitleStore.actions.setOffsetTime({ offsetTime: Number.isNaN(offsetTime) ? 0 : offsetTime });
      }
    });
    return {
      currentTime,
      picker,
      offsetTime,
      reset: () => (offsetTime.value = 0),
      previewSelection: ref('excerpt'),
    };
  }
});
</script>

<style scoped>
.offset-time--container {
  grid-template-areas:
    '.'
    'input-label'
    'input'
    '.'
    'preview-label'
    '.'
    'preview';
  grid-template-rows: 8px auto auto 16px auto 8px auto;
}
</style>
