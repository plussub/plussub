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
          @click="selectVideo(video)"
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
import { srcToVideo, srcToIFrameSource, Video } from '@/video/state';
import { addVttTo, removeVttFrom } from '@/video/state';
import { SubtitleEntry } from '@/subtitle/state/types';
import { postWindowMessage, GetBoundingClientRect } from '@/composables/useWindowMessage';

declare const props: {
  subtitle: SubtitleEntry[];
};

export default {
  emits: ['navigate']
};

export { addVttTo, removeVttFrom };

export const videoList = computed(() => Object.values(srcToVideo.value));

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

const overlayHightlight = document.getElementById('plussub-overlay-highlight');
export const enterVideo = (video: Video): void => {
  const el = video.in === 'HOST' ? video.el : document.querySelector(`iframe[src="${srcToIFrameSource[video.src].frameSrc}"]`);
  if (!el) return;
  if (isElementNotInViewport(el)) {
    el.scrollIntoView({ block: 'center' });
    const plussubShadow = document.getElementById('plussubShadow');
    if (!plussubShadow) return;
    plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
  }
  if (!overlayHightlight) return;
  if (video.in === 'HOST') {
    const { top, left, height, width } = el.getBoundingClientRect();
    overlayHightlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${window.scrollY + top}px; left: ${
      window.scrollX + left
    }px;`;
  } else {
    postWindowMessage({
      window: srcToIFrameSource[video.src].window,
      origin: srcToIFrameSource[video.src].origin,
      payload: {
        plusSubAction: GetBoundingClientRect
      }
    });
    // Not use useWindowMessage as I want to remove event listener immediately
    const handleMessageInPageVideos = (e) => {
      const { plusSubAction, boundingClientRect } = e.data;
      if (plusSubAction === 'Video_Bounding_Client_Rect') {
        window.removeEventListener('message', handleMessageInPageVideos);
        const iframeBoundingClientRect = el.getBoundingClientRect();
        const iFrameTop = iframeBoundingClientRect.top;
        const iFrameLeft = iframeBoundingClientRect.left;
        const { top, left, height, width } = boundingClientRect;
        overlayHightlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${
          window.scrollY + top + iFrameTop
        }px; left: ${window.scrollX + left + iFrameLeft}px;`;
      }
    };
    window.addEventListener('message', handleMessageInPageVideos);
  }
};
export const leaveVideo = () => {
  if (!overlayHightlight) return;
  overlayHightlight.style.cssText = `width: 0px; height: 0px;`;
};
onUnmounted(() => {
  leaveVideo();
});

const videosWithSubtitle = computed(() => Object.values(srcToVideo.value).filter((e) => e.hasSubtitle));
export const pageHasSubtitle = computed(() => videosWithSubtitle.value.length > 0);
export const selectVideo = (video) => {
  video.hasSubtitle = true;
  emit('navigate', { name: 'SEARCH', params: { contentTransitionName: 'content-navigate-deeper' } });
};
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
