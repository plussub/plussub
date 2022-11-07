<template>
  <div class="h-auto overflow-hidden grid app--container">
    <component :is="navigationStore.component" v-if='initializeStore.initialized' v-bind="navigationStore.params" />
    <Loading v-else/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, PropType, watch } from 'vue';
import { useStore as useAppStore } from '@/app/store';
import { useStore as useCloseStore } from '@/close/store';
import { useStore as useVideoStore } from '@/video/store';
import { useStore as useFileStore } from '@/file/store';
import { useStore as useSubtitleStore } from '@/subtitle/store';
import { useStore as useSearchStore } from '@/search/store';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useInitializeStore } from '@/initialize/store';
import { useStore as useAppearanceStore } from '@/appearance/store';

import Home from '@/home/pages/Home.vue';
import Loading from '@/loading/pages/Loading.vue';
import MovieTvSearch from '@/search/pages/movieTv/MovieTvSearch.vue';
import SubtitleSearchForMovies from '@/search/pages/subtitleForMovies/SubtitleSearchForMovies.vue';
import SubtitleSearchForSeries from '@/search/pages/subtitleForSeries/SubtitleSearchForSeries.vue';
import Transcript from '@/transcript/pages/Transcript.vue';
import Settings from '@/settings/pages/Settings.vue';
import '@/styles.css';

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
  props: {
    unmount: {
      type: Function as PropType<() => unknown | undefined>,
      required: true,
    }
  },
  setup(props) {
    const closeStore = useCloseStore();
    closeStore.$patch({unmountFn: props.unmount});
    const appStore = useAppStore();


    const navigationStore = useNavigationStore();
    const subtitleStore = useSubtitleStore();
    const appearanceStore = useAppearanceStore();
    const videoStore = useVideoStore();
    const fileStore = useFileStore();

    const initializeStore = useInitializeStore()
    initializeStore.initialize();

    const searchStore = useSearchStore();


    watch(
      () => videoStore.current,
      (video) => {
        if (video === null) {
          appStore.reset();
          subtitleStore.reset();
          searchStore.reset();
          fileStore.reset();
        }
      }
    );

    watch(
      () => subtitleStore.withOffsetParsed,
      (subtitles) => {
        const subtitleId = subtitleStore.id;
        if (!subtitleId) {
          console.warn('subtitleId is null');
          return;
        }
        appearanceStore.applyStyle();
        videoStore.addVtt({ subtitles, subtitleId, language: subtitleStore.language ?? 'en' });
      }
    );

    onUnmounted(() => initializeStore.unmount());

    watch(
      [initializeStore, computed(() => videoStore.count), appStore,  computed(() =>videoStore.list),  computed(() =>videoStore.current)],
      ([initializeStore, videoCount, appState, videoList], [_prevInitializeStore, prevVideoCount, _prevAppState, _prevVideoList]) => {
        if(!initializeStore.initialized){
          return;
        }
        // navigate if only 1 video exists
        if (videoCount === 1 && videoList[0] && navigationStore.name === 'HOME' && appState.state === 'NONE') {
          videoStore.setCurrent({ video: videoList[0] }).then(() => navigationStore.to("MOVIE-TV-SEARCH", {contentTransitionName: 'content-navigate-deeper'}))
          return;
        }

        // navigate to selection if additional videos appear
        if (videoCount > 1 && prevVideoCount === 1 && navigationStore.name === 'MOVIE-TV-SEARCH' && appState.state === 'NONE') {
          videoStore.removeCurrent().then(() => navigationStore.to("HOME", {contentTransitionName: "content-navigate-shallow" }));
          return;
        }

        if (videoCount === 0 && navigationStore.name !== 'HOME') {
          navigationStore.to("HOME", {contentTransitionName: "content-navigate-shallow" });
          return;
        }
      },
      { immediate: true }
    );

    return {
      navigationStore,
      initializeStore
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
