<template>
  <textarea v-model="excerpt" disabled class="mx-2 rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50 text-xs font-medium box-border resize-none" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { computed } from '@vue/reactivity';
import { subtitleState } from '@/subtitle/state';
import Duration from 'luxon/src/duration';
import { findNext } from './findNext';
import { videoList } from '@/video/state';
import { useTimeUpdate } from '@/video/composable';

export default defineComponent({
  setup() {
    const parsed = computed(() => (subtitleState.value.withOffsetParsed));
    const currentTime = ref<number>(0);
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));

    useTimeUpdate({
      video,
      fn: ({ currentTime: currentTimeFromVideo }): void => {
        currentTime.value = currentTimeFromVideo;
      }
    });

    const currentPos = ref(-1);
    watch(currentTime, (currentTime) => {
      const pos = findNext(Math.ceil(currentTime * 1000), parsed.value);
      if (pos === -1) return;
      currentPos.value = pos;
    });

    return {
      excerpt: computed(() =>
          parsed.value
          .filter((e, idx) => idx >= currentPos.value && idx < currentPos.value + 3)
          .map(({ from, to, text }, i) => `${i + 1}\n${Duration.fromMillis(from).toFormat('hh:mm:ss.SSS')} --> ${Duration.fromMillis(to).toFormat('hh:mm:ss.SSS')}\n${text}\n`)
          .join('\n')
      )
    };
  }
});
</script>
