<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <a v-if="appState.state !== 'NONE'" class="knopf flat pill buttonOnPrimary" @click="toTranscript()">
        <!-- This icon comes from material design icons which is under Apache license -->
        <img :src="subtitleIcon" style="filter: invert(1)" />
      </a>
    </template>
    <template #content>
      <div :class="{ 'home-content--container': appState.state !== 'NONE' }" style="margin-bottom: 24px">
        <ResultFromSearch
          v-if="appState.state !== 'NONE' && appState.src === 'SEARCH'"
          style="grid-area: current-sub; margin-top: 20px"
          :state="appState.state"
          :search-state="subtitleSearchState"
          @remove="remove"
        >
          <template #settings>
            <Settings :parsed="subtitleState.parsed" :offset-time="subtitleState.offsetTime" @offset-time="setOffsetTime" />
          </template>
        </ResultFromSearch>
        <ResultFromFile
          v-else-if="appState.state !== 'NONE' && appState.src === 'FILE'"
          style="grid-area: current-sub; margin-top: 20px"
          :state="appState.state"
          :file-state="fileState"
          @remove="remove"
        >
          <template #settings>
            <Settings :parsed="subtitleState.parsed" :offset-time="subtitleState.offsetTime" @offset-time="setOffsetTime" />
          </template>
        </ResultFromFile>
        <PageVideos v-show="appState.state === 'NONE'" style="grid-area: videos" @selected-src="selectedSrc" />
      </div>
      <div style="font-size: 0.75em; width: 100%; position: absolute; bottom: 0; display: flex; flex-direction: column; align-items: center">
        <div>Subtitle search files provided by <a href="https://opensubtitles.org/" target="_blank">OpenSubtitles</a></div>
        <div>Movie Poster provided by <a href="https://www.themoviedb.org/" target="_blank">tmdb</a></div>
        <div>Icons by <a href="https://fontawesome.com/" target="_blank">font awesome</a></div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { default as subtitleIcon } from '@/res/subtitles-24px.svg';

import { default as PageLayout } from '@/components/PageLayout';
import { default as ResultFromSearch } from './components/ResultFromSearch.vue';
import { default as ResultFromFile } from './components/ResultFromFile.vue';
import { default as PageVideos } from './components/PageVideos';
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
      subtitleIcon,

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
      }
    };
  }
});
</script>

<style scoped>

.home-content--container {
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
