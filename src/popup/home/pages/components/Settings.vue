<template>
  <div>
    <Expandable :open="true">
      <template #title>
        <div class="font-medium font-header">Subtitle Setting</div>
      </template>
      <template #content>
        <div class="grid offset-time--container">
          <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input;">
            <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>
            <input
              v-model="currentOffsetTime"
              class="flex-grow rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50 leading-none"
              type="number"
              step="100"
              @keydown.stop
              @keypress.stop
            />
            <a class="text-primary-500 hover:text-primary-700 flex-grow self-center flex justify-center" @click="setOffsetTime"><span>Apply</span></a>
            <a class="text-primary-500 hover:text-primary-700 flex-grow self-center flex" @click="reset"><span>Reset</span></a>
          </div>
          <div class="font-medium text-xs mx-2" style="grid-area: preview-label;">Preview <span v-if="notApplied" class="text-destructive-icon">(not applied)</span></div>
          <textarea
            v-model="excerpt"
            disabled
            class="mx-2 rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50 text-xs font-medium box-border resize-none"
            style="grid-area: preview; height: 150px; width: calc(100% - 12px);"
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

export default defineComponent({
  components: {
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
    const currentOffsetTime = ref(props.offsetTime ? props.offsetTime : '');
    const setOffsetTime = () => emit('offset-time', { offsetTime: parseInt(currentOffsetTime.value.toString()) });
    return {
      currentOffsetTime,
      setOffsetTime,
      reset: () => {
        currentOffsetTime.value = 0;
        setOffsetTime();
      },

      notApplied: computed(() => {
        if (!props.offsetTime && !currentOffsetTime.value) {
          return false;
        }
        return props.offsetTime !== parseInt(currentOffsetTime.value.toString(), 10);
      }),

      excerpt: computed(() =>
        parsedPartial.value
          .map(({ from, to, text }, i) => {
            const value = parseInt(from, 10);
            return `${i + 1}\n${getTimestamp({
              time: value,
              offset: currentOffsetTime.value
            })} --> ${getTimestamp({ time: to, offset: currentOffsetTime.value })}\n${text}\n`;
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
