<template>
  <div class="videos--card">
    <div
        style="grid-area: header; height: 1px; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500;">
      <div>
        <div>Page Videos</div>
        <div style="font-size: 0.4em; color: var(--default-text-color); font-weight: 400;" v-if="!subtitleSelected">
          You must first add a subtitle before you can add them to the video
        </div>
      </div>
    </div>
    <div style="grid-area: content;">
      <div v-for="(video, index) in state.videos" v-if="state.videos.length" style="display: grid; grid-template-columns: 1fr auto;">
        <div style="grid-column: 1 / 2; align-self: center;">Video {{ index + 1 }}</div>
        <a v-if="video.hasSubtitle" class="knopf flat small" @click="removeSubFrom(video.src)" style="grid-column: 2 / 3;">Remove Sub<i class="fa fa-sm fa-minus"></i></a>
        <a v-else class="knopf flat small" :class="{ disabled: !subtitleSelected}" @click="addSubTo(video.src)" style="grid-column: 2 / 3;">Add Subtitle</a>
      </div>
      <div v-else>
        No videos found in current tab.
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "@vue/reactivity";
import {setAppStatePartial} from "@/appState";
import {addSubtitleInCurrentTab} from 'addSubtitleInCurrentTab';

export default {
  props: {
    subtitleSelected: Boolean
  },
  setup() {
    const findVideosInCurrentTab = () => [...document.querySelectorAll('video')].map((el) => ({
      src: el.src,
      hasSubtitle: el.classList.contains('plussub')
    }));

    const state = reactive({videos: (findVideosInCurrentTab())});
    return {
      state,
      async addSubTo(targetSrc) {
        console.warn('add');
        // await setAppStatePartial({targetSrc});
        // addSubtitleInCurrentTab();
      },
      removeSubFrom: () => {
      }
    }
  }
}
</script>

<style scoped>/* plussub header */
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
  width: 100%;
  height: fit-content;
}
</style>
