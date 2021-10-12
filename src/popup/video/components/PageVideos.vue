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
          @mouseenter="highlightVideo({ video: video })"
          @mouseleave="removeHighlightFromVideo"
          @click="selectVideo(video)"
        >
          <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
          <div class="flex flex-col gap-1 h-11 my-2 justify-center" style="grid-column: 2 / 3">
            <div>Video {{ index + 1 }}</div>
            <div v-if="false" class="text-xs">({{ video.origin }} - {{ video.id }})</div>
          </div>
          <Divider style="grid-column: 1/3" class="border-surface-200" />
        </div>
      </div>
      <div v-else class="px-8">No videos found in current tab.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import { Video } from '@/video/store';

import Divider from '@/components/Divider.vue';
import { useInjectStore } from '@/useInjectStore';

export default defineComponent({
  components: {
    Divider
  },
  setup() {
    const videoStore = useInjectStore('videoStore');
    const navigationStore = useInjectStore('navigationStore');

    onUnmounted(() => videoStore.actions.removeHighlight());

    return {
      highlightVideo: videoStore.actions.highlight,
      removeHighlightFromVideo: videoStore.actions.removeHighlight,
      videoList: videoStore.getters.list,
      selectVideo: (video: Video) => {
        videoStore.actions.setCurrent({ video });
        navigationStore.actions.toMovieTvSearch();
      }
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
