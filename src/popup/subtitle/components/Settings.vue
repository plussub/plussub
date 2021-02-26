<template>
  <sl-tab-group class="plussub-tab-group">
    <sl-tab slot="nav" panel="time">
      <fa icon="clock" class="h-icon-sm mr-2" />
      <span class="mr-2">Time</span> <span style="font-family: var(--sl-font-mono)">{{ currentTime }}</span>
    </sl-tab>
    <sl-tab slot="nav" panel="appearance">
      <fa icon="palette" class="h-icon-sm mr-2" />
      Style
    </sl-tab>
    <sl-tab slot="nav" panel="info">
      <fa icon="question-circle" class="h-icon-sm mr-2" />
      Info
    </sl-tab>

    <sl-tab-panel name="time">
      <div class="grid offset-time--container">
        <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">
          <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>
          <RangeInputField v-model="offsetTime" step="100" min="-3000" max="3000" class="mr-6 w-1/3 flex-grow" />
          <NumberInputField v-model="offsetTime" step="100" type="number" class="pr-2 w-1/2" />
        </div>
        <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">
          <span class="flex-grow">Preview (next 3 subtitles)</span>
          <RadioPair v-model="previewSelection" first="excerpt" second="diagram">
            <template #first> Excerpt</template>
            <template #second> Diagram</template>
          </RadioPair>
        </div>
        <Excerpt v-if="previewSelection === 'excerpt'" style="grid-area: preview; height: 150px; width: calc(100% - 12px)" />
        <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" class="mt-5" />
      </div>
    </sl-tab-panel>
    <sl-tab-panel name="appearance">
      <sl-color-picker ref="picker" opacity inline @sl-change="wat" style="--grid-height: 120px"></sl-color-picker>
    </sl-tab-panel>
    <sl-tab-panel name="info">
      <slot name="info" />
    </sl-tab-panel>
  </sl-tab-group>
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
      wat: (event) => console.warn(picker.value?.getAttribute('value'))
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

sl-tab::part(base) {
  color: var(--sl-color-primary-500);
}

sl-tab[active]::part(base) {
  color: var(--sl-color-primary-700);
}

sl-tab::part(base):hover {
  color: var(--sl-color-primary-700);
}

sl-tab-group::part(active-tab-indicator) {
  border-bottom: solid 2px var(--sl-color-primary-700);
}
</style>
