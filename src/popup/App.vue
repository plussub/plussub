<template>
  <div class="h-auto overflow-hidden grid app--container">
    <component :is="component" v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { init as initAppState } from '@/app/state';
import { init as initVideoState } from '@/video/state';
import { init as initFileState } from '@/file/state';
import { init as initSubtitleState } from '@/subtitle/state';
import { init as initSubtitleSearchState } from '@/search/state';
import { init as initNavigationState, navigationState, setupAutoNavigation } from '@/navigation/state';
import { init as initApi } from '@/api/state';

import { default as Home } from '@/home/pages/Home.vue';
import { default as Search } from '@/search/pages/search/Search.vue';
import { default as SubtitleSelection } from '@/search/pages/subtitleSelection/SubtitleSelection.vue';
import { default as SubtitleSelectionForMovies } from '@/search/pages/subtitleSelection/dev/SubtitleSelectionForMovies.vue';
import { default as SubtitleSelectionForSeries } from '@/search/pages/subtitleSelection/dev/SubtitleSelectionForSeries.vue';
import { default as Transcript } from '@/transcript/pages/Transcript.vue';
import { default as Settings } from '@/settings/pages/Settings.vue';
import '@/styles.css';

export default defineComponent({
  components: {
    Home,
    Search,
    SubtitleSelection,
    SubtitleSelectionForMovies,
    SubtitleSelectionForSeries,
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
  setup(props) {
    const version = computed(() => window.plusSub_api.value.version);

    initAppState();
    initNavigationState();
    initSubtitleState();
    initVideoState();
    initFileState();
    initSubtitleSearchState({ preferredLanguage: props.preferredLanguage });
    initApi({ version: props.apiVersion });
    setupAutoNavigation();
    return {
      component: computed(() => {
        if (navigationState.value.name === 'SEARCH') {
          return Search;
        } else if ((navigationState.value.name === 'SUBTITLE-SELECTION-FOR-MOVIES' || navigationState.value.name === 'SUBTITLE-SELECTION-FOR-SERIES') && version.value === 'stable') {
          return SubtitleSelection;
        } else if (navigationState.value.name === 'SUBTITLE-SELECTION-FOR-MOVIES' && version.value === 'dev') {
          return SubtitleSelectionForMovies;
        } else if (navigationState.value.name === 'SUBTITLE-SELECTION-FOR-SERIES' && version.value === 'dev') {
          return SubtitleSelectionForSeries;
        } else if (navigationState.value.name === 'TRANSCRIPT') {
          return Transcript;
        } else if (navigationState.value.name === 'SETTINGS') {
          return Settings;
        } else {
          return Home;
        }
      }),
      navigationState
    };
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
