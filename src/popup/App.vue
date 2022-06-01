<template>
  <div class="h-auto overflow-hidden grid app--container">
    <component v-if='initialized' :is="navigationState.component" v-bind="navigationState.params" />
    <Loading v-else/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, PropType, provide, watch } from 'vue';
import { init as initAppStore } from '@/app/store';
import { init as initContentScriptStore } from '@/contentScript/store';
import { init as initVideoStore } from '@/video/store';
import { init as initFileStore } from '@/file/store';
import { init as initSubtitleStore } from '@/subtitle/store';
import { init as initSearchStore } from '@/search/store';
import { init as initNavigationStore } from '@/navigation/store';
import { init as initTrackStore } from '@/track/store';
import { init as initAppearanceStore } from '@/appearance/store';

import Home from '@/home/pages/Home.vue';
import Loading from '@/loading/pages/Loading.vue';
import MovieTvSearch from '@/search/pages/movieTv/MovieTvSearch.vue';
import SubtitleSearchForMovies from '@/search/pages/subtitleForMovies/SubtitleSearchForMovies.vue';
import SubtitleSearchForSeries from '@/search/pages/subtitleForSeries/SubtitleSearchForSeries.vue';
import Transcript from '@/subtitle/pages/Transcript.vue';
import Settings from '@/settings/pages/Settings.vue';
import '@/styles.css';
import { Subject } from 'rxjs';

export default defineComponent({
  components: {
    Home,
    Loading,
    MovieTvSearch,
    SubtitleSearchForMovies,
    SubtitleSearchForSeries,
    Transcript,
    Settings
  },
  setup() {
    const appStore = initAppStore();
    provide('appStore', appStore);
    const navigationStore = initNavigationStore();
    provide('navigationStore', navigationStore);
    const subtitleStore = initSubtitleStore({ use: { appStore } });
    provide('subtitleStore', subtitleStore);
    const contentScriptStore = initContentScriptStore();
    const appearanceStore = initAppearanceStore({ use: { contentScriptStore }});
    provide('appearanceStore', appearanceStore);
    const videoStore = initVideoStore({ use: { contentScriptStore, appearanceStore} });
    provide('videoStore', videoStore);
    const fileStore = initFileStore();
    provide('fileStore', fileStore);
    const searchStore = initSearchStore();
    provide('searchStore', searchStore);
    const trackStore = initTrackStore();
    provide('trackStore', trackStore);

    const unmountSubject = new Subject<undefined>();
    contentScriptStore.actions.requestAllContentScriptsToRegister();

    watch(
      () => videoStore.getters.current.value,
      (video) => {
        if (video === null) {
          appStore.actions.reset();
          subtitleStore.actions.reset();
          searchStore.actions.reset();
          fileStore.actions.reset();
        }
      }
    );

    watch(
      () => subtitleStore.state.value.withOffsetParsed,
      (subtitles) => {
        const subtitleId = subtitleStore.state.value.id;
        if (!subtitleId) {
          console.warn('subtitleId is null');
          return;
        }
        appearanceStore.actions.applyStyle();
        videoStore.actions.addVtt({ subtitles, subtitleId, language: subtitleStore.state.value.language ?? 'en' });
      }
    );

    onUnmounted(() => unmountSubject.next(undefined));

    const initialized = computed(() => searchStore.getters.initialized.value && appearanceStore.getters.initialized.value);

    watch(
      [initialized, videoStore.getters.count, appStore.state, videoStore.getters.list, videoStore.getters.current],
      ([initialized, videoCount, appState, videoList], [prevInitialized, prevVideoCount, prevAppState, prevVideoList]) => {
        if(!initialized){
          return;
        }
        // navigate if only 1 video exists
        if (videoCount === 1 && videoList[0] && navigationStore.state.value.name === 'HOME' && appState.state === 'NONE') {
          videoStore.actions.setCurrent({ video: videoList[0] }).then(() => navigationStore.actions.toMovieTvSearch())
          return;
        }

        // navigate to selection if additional videos appear
        if (videoCount > 1 && prevVideoCount === 1 && navigationStore.state.value.name === 'MOVIE-TV-SEARCH' && appState.state === 'NONE') {
          videoStore.actions.removeCurrent().then(() => navigationStore.actions.toHome());
          return;
        }

        if (videoCount === 0 && navigationStore.state.value.name !== 'HOME') {
          navigationStore.actions.toHome();
          return;
        }
      },
      { immediate: true }
    );

    return {
      initialized,
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
  max-height: 1200px;
  min-height: 400px;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}
</style>
