<template>
  <PageLayout :content-transition-name="contentTransitionName" :has-back="videoCount > 1" :back-fn="backFn">
    <template #toolbar>
      <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Search Movie or Series</div>
    </template>
    <template #content>
      <div class="search-content--container">
        <div style="grid-area: search-bar">
          <SearchBar v-model:query="internalQuery" v-model:loading="loading"/>
          <Divider style="margin-top: 4px"/>
        </div>
        <div v-if="searchResults.length" style="grid-area: search-results; overflow-y: auto;">
          <SearchEntry v-for="(item, index) in searchResults" :key="index" :item="item" @select="select" />
        </div>
        <div v-else-if="internalQuery === ''" style="grid-area: search-results;">
          <FilePick v-model:query="internalQuery"/>
        </div>
        <div v-else-if="!loading" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center">
          <div>Sorry, no movies or tv shows found</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
        <div v-if="searchResults.length" style="grid-area: spacer">&nbsp;</div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { searchRequest } from './searchRequest';
import { debounce, useDraggableArea } from '@/composables';
import { ref, watch } from 'vue';
import { TmdbState } from '@/search/state/types';
import { setTmdbInSelection } from '@/search/state/actions/setTmdbInSelection';
import { toSubtitleSelection } from '@/navigation/state/actions/toSubtitleSelection';
import { setCurrentSelectedSrc, toHome } from '@/navigation/state/actions';

export { default as FilePick } from '@/file/components/FilePick.vue';
export { default as PageLayout } from '@/components/PageLayout';
export { default as Divider } from '@/components/Divider';
export { default as SearchBar } from './SearchBar.vue';
export { default as SearchEntry } from './SearchEntry.vue';
export { videoCount } from '@/video/state';

declare const props: {
  query?: string;
  contentTransitionName?: string; // default : ''
};

export const internalQuery = ref(props.query ?? '');
export const searchResults = ref([]);
export const loading = ref(false);

const { fn: req } = debounce<TmdbState[]>({
  fn: searchRequest,
  timeout: 1500,
  resultRef: searchResults,
  loadingRef: loading
});

watch(internalQuery, (query) => req(query), { immediate: true });

export const select = (tmdb: TmdbState): void => {
  setTmdbInSelection(tmdb);
  toSubtitleSelection({
    tmdb_id: tmdb.tmdb_id,
    media_type: tmdb.media_type,
    searchQuery: internalQuery.value,
    contentTransitionName: 'content-navigate-deeper'
  });
};
export const backFn = (): void => {
  setCurrentSelectedSrc(null);
  toHome();
};
</script>

<style scoped>
/* plussub header */
.search-content--container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. .              .'
    '. search-bar     .'
    '. .              .'
    '. search-results .'
    '. .              .';
  grid-template-rows: 16px auto 16px 1fr 16px;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}
</style>
