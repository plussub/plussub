<template>
  <div>
    <Expandable :open="true">
      <template #title>
        <div class="font-medium font-header">Subtitle Setting</div>
      </template>
      <template #content>
        <div class="grid offset-time--container">
          <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">
            <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>
            <div class="w-full flex px-2 mt-0.5">
              <input ref="range" :value="internalOffsetTime" type="range" step="100" min="-3000" max="3000" style="width: 30%" class="mr-6" @input="setOffsetTimeDebounced" />
              <InputField v-model="internalOffsetTime" step="100" type="number" class="pr-2" />
            </div>
          </div>
          <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">
            <span class="flex-grow">Preview (next 5 subtitles)</span>
            <label for="excerpt" class="pr-1">Excerpt</label>
            <input id="excerpt" v-model="previewSelection" type="radio" value="excerpt" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
            <label for="diagram" class="pr-1">Diagram</label>
            <input id="diagram" v-model="previewSelection" type="radio" value="diagram" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0"/>
          </div>
          <Excerpt
            v-if="previewSelection === 'excerpt'"
            style="grid-area: preview; height: 150px; width: calc(100% - 12px)"
          />
          <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" />
        </div>
      </template>
    </Expandable>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { SubtitleEntry } from '@/subtitle/state/types';
import { default as Expandable } from '@/components/Expandable';
import { default as Timeline } from './Timeline';
import { default as Excerpt } from "@/home/pages/components/Excerpt.vue";
import InputField from '@/components/InputField.vue';
import { debounce } from '@/composables';

export default defineComponent({
  components: {
    Excerpt,
    Timeline,
    InputField,
    Expandable
  },
  props: {
    offsetTime: {
      type: Number as PropType<number | string>,
      required: true
    }
  },
  emits: ['offset-time'],
  setup(props, { emit }) {
    const internalOffsetTime = computed({
      get: () => props.offsetTime,
      set: (val) => {
        const offsetTime = parseInt(val.toString());
        return emit('offset-time', { offsetTime: Number.isNaN(offsetTime) ? 0 : offsetTime });
      }
    });

    const { fn: setOffsetTimeDebounced } = debounce<string>({
      fn: (val) => val,
      timeout: 50,
      resultRef: internalOffsetTime
    });
    const range = ref<HTMLInputElement | null>(null);

    return {
      range,
      setOffsetTimeDebounced: () => setOffsetTimeDebounced(range.value?.value),
      internalOffsetTime,
      reset: () => (internalOffsetTime.value = 0),
      previewSelection: ref('excerpt')
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
