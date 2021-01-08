<template>
  <div class="px-2 overflow-y-auto">
    <div v-for="(item) in excerpt" :key="item.text">
      <div class="mt-4 text-xs font-medium flex items-center">
        <span class="mr-2">{{formatTime(item.from)}}</span>
        <fa icon="arrow-right" class="mr-2 h-icon-sm inline-block" />
        <span>{{formatTime(item.to)}}</span>
      </div>
      <div class="text-xs text-sub-text-on-surface-50">
        {{item.text}}
      </div>
    </div>
  </div>
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

    useTimeUpdate({
      video: computed(() => videoList.value.find((e) => e.hasSubtitle)),
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
      excerpt: computed(() => parsed.value.filter((e, idx) => idx >= currentPos.value && idx < currentPos.value + 3)),
      formatTime: (ms) => Duration.fromMillis(ms).toFormat('hh:mm:ss.SSS')
    };
  }
});
</script>
