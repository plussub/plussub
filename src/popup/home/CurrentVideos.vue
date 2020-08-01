<template>
  <div class="videos--card">
    <div
        style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
      Founded videos on this site
    </div>
    <div style="grid-area: card-content;">
      <div v-for="video in state.videos" v-if="state.videos.length">
        {{ video.src }}
        <a v-if="video.hasSubtitle" class="knopf flat small" @click="removeSubFrom(video.src)"><i class="fa fa-sm fa-minus"></i></a>
        <a v-else class="knopf flat small" @click="addSubTo(video.src)"><i class="fa fa-sm fa-plus"></i></a>
      </div>
      <div v-else>
        No videos found in current tab.
      </div>
    </div>
  </div>
</template>

<script>
import {findVideosInCurrentTab} from 'findVideosInCurrentTab';
import {reactive} from "@vue/reactivity";
import {setAppStatePartial} from "@/../shared/appState";
import {addSubtitleInCurrentTab} from 'addSubtitleInCurrentTab';

export default {
  setup: function () {
    const state = reactive({videos: []});
    findVideosInCurrentTab().then(({videos}) => state.videos = videos)
    return {
      state,
      addSubTo: (targetSrc) => {
        addSubtitleInCurrentTab({targetSrc});
      },
      removeSubFrom: () => {
      }
    }
  }
}
</script>

<style scoped>
.videos--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: auto 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
</style>
