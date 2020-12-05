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
          <Divider v-if="index === 0" style="grid-column: 1/3" />
          <div style="grid-column: 2 / 3; height: 45px; display: flex; align-items: center">
            <div>Video {{ index + 1 }}</div>
          </div>
          <Divider style="grid-column: 1/3" />
        </div>
      </div>
      <div v-else style="padding-left: 16px">No videos found in current tab.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import { Video, videoList } from '@/video/state';
import { leaveVideo, enterVideo } from '@/util/hover';

import { default as Divider } from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider
  },
  emits: ['selected-src'],
  setup(_, { emit }) {
    onUnmounted(() => {
      leaveVideo();
    });

    return {
      enterVideo,
      leaveVideo,
      videoList,
      selectVideo: (video: Video): void => emit('selected-src', video.src)
    };
  }
});
</script>

<style scoped>

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
