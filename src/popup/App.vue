<template>
  <div class="h-auto overflow-hidden grid app--container">
    <component :is="component" v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide } from 'vue';
import { init as initAppStore } from '@/app/store';
import { init as initCurrentSelectedVideoSrcStore } from '@/currentSelectedVideoSrc/store';
import { init as initVideoState } from '@/video/state';
import { init as initFileStore } from '@/file/store';
import { init as initSubtitleStore } from '@/subtitle/store';
import { init as initSearchStore } from '@/search/store';
import { init as initNavigationStore } from '@/navigation/store';
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
    provide('currentSelectedVideoSrcStore', initCurrentSelectedVideoSrcStore());
    const navigationStore = initNavigationStore();
    provide('navigationStore', navigationStore);
    const subtitleStore = initSubtitleStore({ use: { appStore } });
    provide('subtitleStore', subtitleStore);
    initVideoState();
    provide('fileStore', initFileStore());
    provide('searchStore', initSearchStore({ preferredLanguage: props.preferredLanguage }));
    const apiStore = initApiStore({ version: props.apiVersion });
    provide('apiStore', apiStore);

    // todo: auto navigation
    // watch(
    //     [videoCount, appStateState, videoList],
    //     ([videoCount, _, videoList], [prevVideoCount,prev_, prevVideoList]) => {
    //
    //       // navigate if only 1 video exists
    //       if (videoCount === 1 && navigationState.value.name === 'HOME' && appState.value.state === 'NONE') {
    //         setCurrentSelectedSrc(videoList[0].src);
    //         toSearch();
    //         return;
    //       }
    //
    //       // hack: set current src if video src change like vimeo next
    //       if(videoCount === 1 && videoList[0].src !== (prevVideoList ?? [{src: null}])[0]?.src){
    //         setCurrentSelectedSrc(videoList[0].src);
    //       }
    //
    //       // navigate to selection if additional videos appear
    //       if (videoCount > 1 && prevVideoCount === 1 && navigationState.value.name === 'SEARCH' && appState.value.state === 'NONE') {
    //         setCurrentSelectedSrc(null);
    //         toHome();
    //         return;
    //       }
    //
    //       if (videoCount === 0 && navigationState.value.name !== 'HOME') {
    //         toHome();
    //         return;
    //       }
    //     },
    //     { immediate: true }
    // );

    return {
      component: computed(() => {
        if (navigationStore.state.value.name === 'MOVIE-TV-SEARCH') {
          return MovieTvSearch;
        } else if ((navigationStore.state.value.name === 'SUBTITLE-SEARCH-FOR-MOVIES' || navigationStore.state.value.name === 'SUBTITLE-SEARCH-FOR-SERIES') && apiStore.state.value.version === 'stable') {
          return SubtitleSearch;
        } else if (navigationStore.state.value.name === 'SUBTITLE-SEARCH-FOR-MOVIES' && apiStore.state.value.version === 'dev') {
          return SubtitleSearchForMovies;
        } else if (navigationStore.state.value.name === 'SUBTITLE-SEARCH-FOR-SERIES' && apiStore.state.value.version === 'dev') {
          return SubtitleSearchForSeries;
        } else if (navigationStore.state.value.name === 'TRANSCRIPT') {
          return Transcript;
        } else if (navigationStore.state.value.name === 'SETTINGS') {
          return Settings;
        } else {
          return Home;
        }
      }),
      navigationState: navigationStore.state
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
