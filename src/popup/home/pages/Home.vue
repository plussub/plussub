<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <a class="self-center pr-4" v-if="appState.state !== 'NONE'" @click="toTranscript()">
        <fa type="local" icon="caption" class="h-icon hover:text-on-primary-hover-500"></fa>
      </a>
    </template>
    <template #content>
      <div class="flex flex-wrap h-full home-content--container" :class="{ 'bg-surface-100': current === 'search-card' || current === 'file-card' }">
        <ResultFromSearch v-if="current === 'search-card'" class="m-2" :state="appState.state" :search-state="subtitleSearchState" @remove="remove">
          <template #settings>
            <Settings :parsed="subtitleState.parsed" :offset-time="subtitleState.offsetTime" @offset-time="setOffsetTime" />
          </template>
        </ResultFromSearch>

        <ResultFromFile v-else-if="current === 'file-card'" class="m-2" :state="appState.state" :file-state="fileState" @remove="remove">
          <template #settings>
            <Settings :parsed="subtitleState.parsed" :offset-time="subtitleState.offsetTime" @offset-time="setOffsetTime" />
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
import { computed, defineComponent, PropType } from 'vue';

import { default as PageLayout } from '@/components/PageLayout.vue';
import { default as ResultFromSearch } from './components/ResultFromSearch.vue';
import { default as ResultFromFile } from './components/ResultFromFile.vue';
import { default as PageVideos } from './components/PageVideos.vue';
import { default as Settings } from './components/Settings.vue';

import { setCurrentSelectedSrc, toSearch, toTranscript } from '@/navigation/state';
import { subtitleState, setOffsetTime } from '@/subtitle/state';
import { appState, reset } from '@/app/state';
import { subtitleSearchState } from '@/search/state';
import { fileState } from '@/file/state';

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
    return {
      appState,
      subtitleState,
      subtitleSearchState,
      fileState,

      setOffsetTime,

      toTranscript,

      remove: (): void => {
        reset();
        setCurrentSelectedSrc(null);
      },
      selectedSrc: (src: string): void => {
        setCurrentSelectedSrc(src);
        toSearch();
      },
      current: computed(() => {
        if (appState.value.state !== 'NONE' && appState.value.src === 'SEARCH') {
          return 'search-card';
        }
        if (appState.value.state !== 'NONE' && appState.value.src === 'FILE') {
          return 'file-card';
        }
        if (appState.value.state === 'NONE') {
          return 'page-videos';
        }
        return 'unkown';
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
    '. current-sub .'
    'videos videos videos'
    '. contribution .';
  grid-template-rows: auto 1fr auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
  row-gap: 16px;
}
</style>
