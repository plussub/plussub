<template>
  <div class='grid offset-time--container'>
    <div class='flex w-full flex-wrap mx-2 focus-within:text-primary-700' style='grid-area: input'>
      <div class='text-xs font-medium w-full' style='grid-area: input-label'>Offset time (in ms)</div>
      <RangeInputField v-model='offsetTime' step='100' min='-3000' max='3000' class='mr-6 w-1/3 flex-grow' />
      <NumberInputField v-model='offsetTime' step='100' class='pr-2 w-1/2' />
    </div>
    <div class='font-medium text-xs mx-2 flex' style='grid-area: preview-label'>
      <span class='flex-grow'>Preview (next 3 subtitles)</span>
      <label for='excerpt' class='pr-1'>Excerpt</label>
      <input
        id='excerpt'
        v-model='previewSelection'
        type='radio'
        value='excerpt'
        class='mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0' />
      <label for='diagram' class='pr-1'>Diagram</label>
      <input
        id='diagram'
        v-model='previewSelection'
        type='radio'
        value='diagram'
        class='mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0' />
    </div>
    <Excerpt
      v-if="previewSelection === 'excerpt'"
      style='grid-area: preview; height: 150px; width: calc(100% - 12px)'
      :excerpt='store.excerpt'>
      <template #from='{from}'>
        <span class="mr-2">{{ store.formatTime(from) }}</span>
      </template>
      <template #to='{to}'>
        <span>{{ store.formatTime(to) }}</span>
      </template>
    </Excerpt>

    <Timeline
      v-else
      :excerpt="store.excerpt"
      :current-time="store.currentTime"
      style='grid-area: preview; height: 80px; width: calc(100% - 12px)' class='mt-5' />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue';
import Timeline from '@/subtitle/components/Timeline.vue';
import Excerpt from '@/subtitle/components/Excerpt.vue';
import NumberInputField from '@/components/NumberInputField.vue';
import RangeInputField from '@/components/RangeInputField.vue';
import { useStore } from './timeSettingsTabStore';

export default defineComponent({
  components: {
    RangeInputField,
    Excerpt,
    Timeline,
    NumberInputField
  },
  setup() {
    const store = useStore();

    const offsetTime = computed({
      get: () => store.offsetTime,
      set: (val) => {
        if (val === undefined) {
          return;
        }
        store.setOffsetTime({ offsetTime: parseInt(val.toString(), 10) });
      }
    });
    return {
      store,
      offsetTime,
      reset: () => (offsetTime.value = 0),
      previewSelection: ref('excerpt')
    };
  }
});
</script>

<style scoped>
.offset-time--container {
  grid-template-areas:
    'input-label'
    'input'
    '.'
    'preview-label'
    '.'
    'preview';
  grid-template-rows: auto auto 2rem auto 0.5rem auto;
}
</style>
