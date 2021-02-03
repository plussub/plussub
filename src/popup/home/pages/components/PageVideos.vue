<template>
  <div class="grid py-2 h-fit videos--card">
    <div class="h-px text-2xl font-header font-medium" style="grid-area: header">
      <div>Page Videos</div>
    </div>
    <div style="grid-area: content">
      <div v-if="videoList.length">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          style="grid-template-columns: 8px 1fr auto"
          class="grid hover:cursor-pointer video-item hover:bg-primary-700 hover:text-on-primary-700"
          @mouseenter="highlightVideo({videoSrc: video.src})"
          @mouseleave="removeHighlightFromVideo"
          @click="selectVideo(video, index)"
        >
          <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
          <div class="flex items-center h-11" style="grid-column: 2 / 3">
            <div>Video {{ index + 1 }}</div>
          </div>
          <Divider style="grid-column: 1/3" class="border-surface-200" />
        </div>
      </div>
      <div v-else class="px-8">No videos found in current tab.</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject, onUnmounted} from 'vue';
import {Video, VideoStore} from '@/video/store';

import Divider from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider
  },
  emits: ['selected-src'],
  setup(_, { emit }) {
    const videoStore = inject<VideoStore>('videoStore');
    if (!videoStore) {
      throw new Error('inject failed');
    }
    onUnmounted(() => {
      videoStore.actions.removeHighlightFromVideo();
    });

    return {
      highlightVideo: videoStore.actions.highlightVideo,
      removeHighlightFromVideo: videoStore.actions.removeHighlightFromVideo,
      videoList: videoStore.getters.videoList,
      selectVideo: (video: Video): void => emit('selected-src', video.src)
    };
  }
});
</script>

<style scoped>
.videos--card {
  grid-template-areas:
    '. header .'
    '. . .'
    'content content content'
    '. . .';
  grid-template-rows: 50px 4px auto 8px;
  grid-template-columns: 16px auto 16px;
}
</style>
