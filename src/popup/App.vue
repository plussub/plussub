<template>
  <div class="h-auto overflow-hidden grid app--container">
    <component :is="component" v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide } from 'vue';
import { init as initAppStore } from '@/app/store';
import { init as initVideoState } from '@/video/state';
import { init as initFileStore } from '@/file/store';
import { init as initSubtitleStore } from '@/subtitle/store';
import { init as initSearchStore } from '@/search/store';
import { init as initNavigationState, navigationState, setupAutoNavigation } from '@/navigation/state';
import { init as initApiStore } from '@/api/store';

import Home from '@/home/pages/Home.vue';
import MovieTvSearch from '@/search/pages/movieTv/MovieTvSearch.vue';
// legacy:
import SubtitleSearch from '@/search/pages/subtitle/SubtitleSearch.vue';
import SubtitleSearchForMovies from '@/search/pages/subtitleForMovies/SubtitleSearchForMovies.vue';
import SubtitleSearchForSeries from '@/search/pages/subtitleForSeries/SubtitleSearchForSeries.vue';
import Transcript from '@/subtitle/pages/Transcript.vue';
import Settings from '@/settings/pages/Settings.vue';
import '@/styles.css';

export default defineComponent({
  components: {
    Home,
    MovieTvSearch,
    SubtitleSearch,
    SubtitleSearchForMovies,
    SubtitleSearchForSeries,
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
    const appStore = initAppStore();
    provide('appStore', appStore);
    initNavigationState();
    const subtitleStore = initSubtitleStore({ use: { appStore } });
    provide('subtitleStore', subtitleStore);
    initVideoState();
    provide('fileStore', initFileStore());
    provide('searchStore', initSearchStore({ preferredLanguage: props.preferredLanguage }));
    const apiStore = initApiStore({ version: props.apiVersion });
    provide('apiStore', apiStore);
    setupAutoNavigation();
    return {
      component: computed(() => {
        if (navigationState.value.name === 'SEARCH') {
          return MovieTvSearch;
        } else if ((navigationState.value.name === 'SUBTITLE-SELECTION-FOR-MOVIES' || navigationState.value.name === 'SUBTITLE-SELECTION-FOR-SERIES') && apiStore.state.value.version === 'stable') {
          return SubtitleSearch;
        } else if (navigationState.value.name === 'SUBTITLE-SELECTION-FOR-MOVIES' && apiStore.state.value.version === 'dev') {
          return SubtitleSearchForMovies;
        } else if (navigationState.value.name === 'SUBTITLE-SELECTION-FOR-SERIES' && apiStore.state.value.version === 'dev') {
          return SubtitleSearchForSeries;
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
