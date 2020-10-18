<template>
  <div>
    <Expandable :open="true">
      <template #title>
        <div style="font-weight: 500; font-family: 'Rubik', sans-serif">Subtitle Setting</div>
      </template>
      <template #content>
        <div class="offset-time--container">
          <div style="grid-area: input-label; font-weight: 500; font-size: 0.75em">Offset time (in ms)</div>
          <div style="grid-area: input; display: flex; width: 100%">
            <input v-model="currentOffsetTime" style="height: 1.5em; flex-grow: 1; font-size: 1em" type="number" step="100" @keydown.stop @keypress.stop />
            <div>
              <a class="knopf flat small" @click="setOffsetTime">Apply</a>
              <a class="knopf flat small" @click="reset">Reset</a>
            </div>
          </div>
          <div style="grid-area: preview-label; font-weight: 500; font-size: 0.75em">Preview <span v-if="notApplied" style="color: #c35e5e">(not applied)</span></div>
          <textarea
            v-model="excerpt"
            disabled
            style="grid-area: preview; width: 100%; resize: none; height: 150px; font-size: 0.75em; font-family: Roboto, sans-serif; font-weight: 500; box-sizing: border-box"
          >
          </textarea>
        </div>
      </template>
    </Expandable>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
// import { useKeydownPreventInputHandler } from '@/composables';
import { formatBiggestUnitHoursSmallestUnitMilliseconds } from '@/util/time';
import { SubtitleEntry } from '@/subtitle/state/types';

declare const props: {
  parsed: SubtitleEntry[];
  offsetTime: number | string;
};

export { default as Expandable } from '@/components/Expandable';

export default {
  emits: ['offset-time']
};

// export const inputRef = ref(null);

export const currentOffsetTime = ref(props.offsetTime ? props.offsetTime : '');

// export const onKeydown = useKeydownPreventInputHandler({
//   allowedInputValue: /^[0-9-]$/,
//   inputRef,
//   valueRef: currentOffsetTime
// });

export const setOffsetTime = () => emit('offset-time', { offsetTime: parseInt(currentOffsetTime.value.toString()) });

export const reset = () => {
  currentOffsetTime.value = 0;
  setOffsetTime();
};

export const notApplied = computed(() => {
  if (!props.offsetTime && !currentOffsetTime.value) {
    return false;
  }
  return props.offsetTime !== parseInt(currentOffsetTime.value.toString(), 10);
});

const getTimestamp = ({ time, offset }): string => {
  const parsedOffset = parseInt(offset, 10);
  const value = parseInt(time, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
  return formatBiggestUnitHoursSmallestUnitMilliseconds({ time: value });
};

const parsedPartial = computed(() => JSON.parse(JSON.stringify(props.parsed.length > 10 ? props.parsed.slice(0, 10) : props.parsed)));

export const excerpt = computed(() => {
  return parsedPartial.value
    .map(({ from, to, text }, i) => {
      const value = parseInt(from, 10); //+ (isNaN(<number>currentOffsetTime.value) ? 0 : currentOffsetTime.value);
      return `${i + 1}\n${getTimestamp({ time: value, offset: currentOffsetTime.value })} --> ${getTimestamp({ time: to, offset: currentOffsetTime.value })}\n${text}\n`;
    })
    .join('\n');
});
</script>

<style scoped>
/* plussub header */
.offset-time--container {
  display: grid;
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
