<template>
  <div class="videos--card">
    <div style="grid-area: header; height: 1px; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500">
      <div>
        <div>Page Videos</div>
      </div>
    </div>
    <div style="grid-area: content">
      <div v-if="videoList.length">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          style="display: grid; grid-template-columns: 8px 1fr auto"
          class="video-item"
          @mouseenter="enterVideo(video)"
          @mouseleave="leaveVideo"
          @click="selectVideo(video, index)"
        >
          <Divider style="grid-column: 1/3"/>
          <div style="grid-column: 2 / 3;height: 45px; display: flex; align-items: center;">
            <div>Video {{ index + 1 }}</div>
          </div>
        </div>
      </div>
      <div v-else>No videos found in current tab.</div>
    </div>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import { onUnmounted } from 'vue';
import { Video } from '@/video/state';
import { leaveVideo } from '@/util/hover';

export { default as Divider } from '@/components/Divider';

export { enterVideo } from '@/util/hover';
export { videoList } from '@/video/state';
export { leaveVideo };

export default {
  emits: ['selected-src']
};

export const selectVideo = (video: Video): void => {
  emit('selected-src', video.src);
};
onUnmounted(() => {
  leaveVideo();
});
</script>

<style scoped>
/* plussub header */
.videos--card {
  background-color: var(--surface-color);
  /*box-shadow: var(--card-shadow);*/
  /*border-radius: var(--card-border-radius);*/
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. header .'
    '. . .'
    'content content content'
    '. . .';
  grid-template-rows: 50px 4px auto 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  /* width: 100%; */
  height: fit-content;
}

.video-item:hover {
  background-color: var(--hoverColorOnSurfce);
  cursor: pointer;
}
</style>
