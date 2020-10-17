<template>
  <div class="videos--card">
    <div style="grid-area: header; height: 1px; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500">
      <div>
        <div>Page Videos</div>
        <!-- <div v-if="subtitle.length === 0" style="font-size: 0.4em; color: var(--default-text-color); font-weight: 400">You must first add a subtitle before you can add them to the video</div> -->
      </div>
    </div>
    <div style="grid-area: content">
      <div v-if="videoList.length">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          style="display: grid; grid-template-columns: 1fr auto"
          class="video-item"
          @mouseenter="enterVideo(video)"
          @mouseleave="leaveVideo"
          @click="selectVideo(video, index)"
        >
          <div style="grid-column: 1 / 2; align-self: center">Video {{ index + 1 }}</div>
          <!-- <a v-if="video.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeVttFrom({ video })">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }" style="grid-column: 2 / 3" @click="addVttTo({ video, subtitle })"> Add Subtitle</a> -->
        </div>
      </div>
      <div v-else>No videos found in current tab.</div>
    </div>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed, onUnmounted } from 'vue';
import { srcToVideo, Video } from '@/video/state';
import { addVttTo, removeVttFrom } from '@/video/state';
import { SubtitleEntry } from '@/subtitle/state/types';
export { enterVideo, leaveVideo } from '@/util/hover';

declare const props: {
  subtitle: SubtitleEntry[];
};

export default {
  emits: ['navigate']
};

export { addVttTo, removeVttFrom };

export const videoList = computed(() => Object.values(srcToVideo.value));
export const selectVideo = (video: Video, index: number): void => {
  // hasSubtitle means selected now
  video.hasSubtitle = true;
  emit('navigate', { name: 'SEARCH', params: { videoIndex: index + 1, contentTransitionName: 'content-navigate-deeper' } });
};
onUnmounted(() => {
  leaveVideo();
});
</script>

<style scoped>
/* plussub header */
.videos--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-border-radius);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. header .'
    '. . .'
    '. content .'
    '. . .';
  grid-template-rows: 50px 16px auto 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  /* width: 100%; */
  height: fit-content;
  margin: 10px 8px 0 8px;
}
.video-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
