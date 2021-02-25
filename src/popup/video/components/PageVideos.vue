<template>
  <div class="grid py-2 h-fit videos--card">
    <div class="h-px text-2xl font-header font-medium" style="grid-area: header">
      <div>Page Videos</div>
    </div>
    <div style="grid-area: content">
      <div class="q-pa-md row items-start q-gutter-md">
        <q-color v-model="hexa" class="my-picker" />
      </div>

      <q-btn color="primary" label="Primary" />

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
import {defineComponent, inject, onUnmounted, ref} from 'vue';
import { Video, VideoStore } from '@/video/store';

import Divider from '@/components/Divider.vue';
import { NavigationStore } from '@/navigation/store';

export default defineComponent({
  components: {
    Divider
  },
  setup() {
    const videoStore = inject<VideoStore>('videoStore');
    const navigationStore = inject<NavigationStore>('navigationStore');

    if (!videoStore || !navigationStore) {
      throw new Error('inject failed');
    }
    onUnmounted(() => {
      videoStore.actions.removeHighlight();
    });

    return {
      hexa: ref('#FF00FFCC'),
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
