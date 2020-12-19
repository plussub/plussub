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
              <input ref="range" :value="internalOffsetTime" type="range" step="100" min="-3000" max="3000" style="width: 30%" class="mr-6" @input="setOffsetTimeDebounced"/>
              <InputField v-model="internalOffsetTime" step="100" type="number" class="pr-2" />
            </div>
          </div>
          <div class="font-medium text-xs mx-2" style="grid-area: preview-label">Preview</div>
          <textarea
            v-model="excerpt"
            disabled
            class="mx-2 rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50 text-xs font-medium box-border resize-none"
            style="grid-area: preview; height: 150px; width: calc(100% - 12px)"
          >
          </textarea>
        </div>
      </template>
    </Expandable>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { SubtitleEntry } from '@/subtitle/state/types';
import Duration from 'luxon/src/duration.js';
import { default as Expandable } from '@/components/Expandable';
import InputField from '@/components/InputField.vue';
import { debounce } from '@/composables';

export default defineComponent({
  components: {
    InputField,
    Expandable
  },
  props: {
    parsed: {
      type: Array as PropType<SubtitleEntry[]>,
      required: true
    },
    offsetTime: {
      type: Number as PropType<number | string>,
      required: true
    }
  },
  emits: ['offset-time'],
  setup(props, { emit }) {
    const parsedPartial = computed(() => JSON.parse(JSON.stringify(props.parsed.length > 10 ? props.parsed.slice(0, 10) : props.parsed)));
    const getTimestamp = ({ time, offset }): string => {
      const parsedOffset = parseInt(offset, 10);
      const value = parseInt(time, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
      return Duration.fromMillis(value).toFormat('hh:mm:ss.SSS');
    };

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
    const range = ref<HTMLElement | null>(null);

    return {
      range,
      setOffsetTimeDebounced: () => setOffsetTimeDebounced(range.value.value),
      internalOffsetTime,
      reset: () => (internalOffsetTime.value = 0),

      excerpt: computed(() =>
        parsedPartial.value
          .map(({ from, to, text }, i) => {
            const value = parseInt(from, 10);
            return `${i + 1}\n${getTimestamp({
              time: value,
              offset: internalOffsetTime.value
            })} --> ${getTimestamp({ time: to, offset: internalOffsetTime.value })}\n${text}\n`;
          })
          .join('\n')
      )
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
    'preview';
  grid-template-rows: 8px auto auto 16px auto auto;
}
</style>
