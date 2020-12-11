<template>
  <div v-if="navigationState.name === 'SEARCH'" class="h-auto overflow-hidden grid app--container">
    <Search v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'SUBTITLE-SELECTION'" class="h-auto overflow-hidden grid	app--container">
    <SubtitleSelection v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'TRANSCRIPT'" class="h-auto overflow-hidden grid app--container">
    <Transcript v-bind="navigationState.params" />
  </div>
  <div v-else class="h-auto overflow-hidden grid app--container">
    <Home v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { init as initAppState } from '@/app/state';
import { init as initVideoState } from '@/video/state';
import { init as initFileState } from '@/file/state';
import { init as initSubtitleState } from '@/subtitle/state';
import { init as initSubtitleSearchState } from '@/search/state';
import { init as initNavigationState, setupAutoNavigation, navigationState } from '@/navigation/state';

import { default as Home } from '@/home/pages/Home.vue';
import { default as Search } from '@/search/pages/search/Search.vue';
import { default as SubtitleSelection } from '@/search/pages/subtitleSelection/SubtitleSelection.vue';
import { default as Transcript } from '@/transcript/pages/Transcript.vue';
import "@/styles.css"

export default defineComponent({
  components: {
    Home,
    Search,
    SubtitleSelection,
    Transcript
  },
  setup(){
    initAppState();
    initNavigationState();
    initSubtitleState();
    initVideoState();
    initFileState();
    initSubtitleSearchState();
    setupAutoNavigation();
    return {
      navigationState
    }
  }
});
</script>

<style>
:host {
  all: initial;
}
</style>
<style scoped>

.app--container {
  max-width: 400px;
  width: 400px;
  max-height: 720px;
  min-height: 400px;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}
</style>
