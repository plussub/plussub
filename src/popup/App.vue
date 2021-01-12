<template>
  <div v-if="navigationState.name === 'SEARCH'" class="h-auto overflow-hidden grid app--container">
    <Search v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'SUBTITLE-SELECTION' && version === 'stable'" class="h-auto overflow-hidden grid	app--container">
    <SubtitleSelection v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'SUBTITLE-SELECTION' && version === 'dev'" class="h-auto overflow-hidden grid	app--container">
    <SubtitleSelectionDev v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'TRANSCRIPT'" class="h-auto overflow-hidden grid app--container">
    <Transcript v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'SETTINGS'" class="h-auto overflow-hidden grid app--container">
    <Settings v-bind="navigationState.params"/>
  </div>
  <div v-else class="h-auto overflow-hidden grid app--container">
    <Home v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import { init as initAppState } from '@/app/state';
import { init as initVideoState } from '@/video/state';
import { init as initFileState } from '@/file/state';
import { init as initSubtitleState } from '@/subtitle/state';
import { init as initSubtitleSearchState } from '@/search/state';
import { init as initNavigationState, setupAutoNavigation, navigationState } from '@/navigation/state';
import { init as initApi } from '@/api/state';

import { default as Home } from '@/home/pages/Home.vue';
import { default as Search } from '@/search/pages/search/Search.vue';
import { default as SubtitleSelection } from '@/search/pages/subtitleSelection/SubtitleSelection.vue';
import { default as SubtitleSelectionDev } from '@/search/pages/subtitleSelection/SubtitleSelectionDev.vue';
import { default as Transcript } from '@/transcript/pages/Transcript.vue';
import { default as Settings } from '@/settings/pages/Settings.vue';
import "@/styles.css"

export default defineComponent({
  components: {
    Home,
    Search,
    SubtitleSelection,
    SubtitleSelectionDev,
    Transcript,
    Settings
  },
  props: {
    preferredLanguage: {
      type: String as PropType<string>,
      required: true
    },
    apiVersion: {
      type: String as PropType<'dev' | 'stable'>,
      required: true
    }
  },
  setup(props){
    initAppState();
    initNavigationState();
    initSubtitleState();
    initVideoState();
    initFileState();
    initSubtitleSearchState({preferredLanguage: props.preferredLanguage});
    initApi({version: props.apiVersion})
    setupAutoNavigation();
    return {
      version: computed(() => window.plusSub_api.value.version),
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
