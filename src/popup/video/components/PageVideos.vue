<template>
  <div class="w-full">
    <div class="flex relative pl-4 py-4 bg-primary-50 shadow-md font-medium text-xl">
      <div>Page Videos</div>
    </div>
    <div>
      <div v-if="videos.length">
        <div
          v-for="(video, index) in videos"
          :key="index"
          style="grid-template-columns: 8px 1fr auto"
          class="grid hover:cursor-pointer video-item hover:bg-primary-700 hover:text-on-primary-700"
          @mouseenter="$emit('video-enter', {video})"
          @mouseleave="$emit('video-leave', {video})"
          @click="$emit('select',video)"
        >
          <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
          <div class="grid gap-1 h-11 my-2 justify-center gap-x-4" style="grid-column: 2 / 3; grid-template-columns: auto 1fr">
            <img :src="video.screenshot" class='h-11' crossorigin="anonymous" style='background-color: black'>
            <div class='self-center'>Video {{ index + 1 }} ({{ formatTime(video.lastTimestamp, 'hh:mm:ss') }})</div>
          </div>
          <Divider style="grid-column: 1/3" class="border-surface-200" />
        </div>
      </div>
      <div v-else class="px-8 pt-4">No videos found in current tab.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType } from 'vue';
import { Duration } from 'luxon';

import Divider from '@/components/Divider.vue';
import { Video } from '@/video/store';

export default defineComponent({
  components: {
    Divider
  },
  props: {
    videos: {
      type: Array as PropType<Video[]>,
      default: () => []
    },
  },
  emits: ['select', 'unmount', 'video-leave', 'video-enter'],
  setup(props, {emit}) {
    onUnmounted(() => emit("unmount"));

    return {
      formatTime: (ms, fmt) => Duration.fromMillis(ms).toFormat(fmt)
    };
  }
});
</script>