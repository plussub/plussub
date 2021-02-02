<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <a class="self-center pr-4" v-if="appState.state !== 'NONE'" @click="toTranscript()">
        <fa type="local" icon="caption" class="h-icon hover:text-on-primary-hover-500"></fa>
      </a>
      <a class="self-center pr-4" @click="toSettings()">
        <fa icon="cog" class="h-icon hover:text-on-primary-hover-500"></fa>
      </a>
    </template>
    <template #content>
      <div class="flex flex-wrap h-full home-content--container" :class="{ 'bg-surface-100': current === 'search-card' || current === 'file-card' }">
        <ResultFromSearch v-if="current === 'search-card'" class="m-2">
          <template #settings>
            <Settings />
          </template>
        </ResultFromSearch>

        <ResultFromFile v-else-if="current === 'file-card'" class="m-2">
          <template #settings>
            <Settings />
          </template>
        </ResultFromFile>

        <PageVideos v-else-if="current === 'page-videos'" class="w-full" @selected-src="selectedSrc" />

        <div class="text-xs w-full flex flex-wrap items-center self-end justify-center mb-1 gap-1">
          <span>
            <span class="pr-1">Subtitles by</span>
            <a href="https://opensubtitles.org/" target="_blank" class="inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline pr-1">
              <span>OpenSubtitles</span>
              <fa icon="external-link-alt" class="self-center h-icon-sm pb-1" />
            </a>
            <span>•</span>
          </span>
          <span>
            <span class="pr-1">Movie infos by</span>
            <a href="https://www.themoviedb.org/" target="_blank" class="inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline pr-1">
              <span>TMDb</span>
              <fa icon="external-link-alt" class="self-center h-icon-sm pb-1" />
            </a>
            <span>•</span>
          </span>
          <span>
            <span class="pr-1">Icons by</span>
            <a href="https://fontawesome.com/" target="_blank" class="inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline">
              <span>Font Awesome</span>
              <fa icon="external-link-alt" class="self-center h-icon-sm pb-1" />
            </a>
          </span>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import ResultFromSearch from '@/search/components/ResultFromSearch.vue';
import ResultFromFile from '@/file/components/ResultFromFile.vue';
import PageVideos from './components/PageVideos.vue';
import Settings from '@/subtitle/components/Settings.vue';

import { AppStore } from '@/app/store';
import {NavigationStore} from "@/navigation/store";
import {CurrentSelectedVideoSrcStore} from "@/currentSelectedVideoSrc/store";

export default defineComponent({
  components: {
    PageLayout,
    ResultFromSearch,
    ResultFromFile,
    PageVideos,
    Settings
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const appStore = inject<AppStore>('appStore');
    const navigationStore = inject<NavigationStore>('navigationStore');
    const currentSelectedVideoSrcStore = inject<CurrentSelectedVideoSrcStore>('currentSelectedVideoSrcStore');

    if (!appStore || !navigationStore || !currentSelectedVideoSrcStore) {
      throw new Error('inject failed');
    }

    return {
      appState: appStore.state,
      toTranscript: navigationStore.actions.toTranscript,
      toSettings: navigationStore.actions.toSettings,
      selectedSrc: (src: string): void => {
        currentSelectedVideoSrcStore.actions.setCurrent(src);
        navigationStore.actions.toMovieTvSearch();
      },
      current: computed(() => {
        if (appStore.state.value.state !== 'NONE' && appStore.state.value.src === 'SEARCH') {
          return 'search-card';
        }
        if (appStore.state.value.state !== 'NONE' && appStore.state.value.src === 'FILE') {
          return 'file-card';
        }
        if (appStore.state.value.state === 'NONE') {
          return 'page-videos';
        }
        return 'unknown';
      })
    };
  }
});
</script>

<style scoped>
.home-content--container {
  min-height: 300px;
  max-height: 500px;
}

.home-content--container-old {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    'current-sub'
    'videos'
    'contribution';
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  row-gap: 16px;
}
</style>
