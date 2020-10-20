<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <ToolbarBackBtn v-if="videoCount > 1" style="height: 100%" />
        <a v-else class="knopf flat pill sharp buttonOnPrimary" @click="close"><i class="fa fa-times fa-lg"></i></a>
        <SearchBar v-model:query="internalQuery" v-model:loading="loading" style="flex-grow: 1; align-content: center; z-index: 10000" />
      </div>
    </template>
    <template #content>
      <div class="search-content--container">
        <div v-if="searchResults.length" style="grid-area: search-results">
          <SearchEntry v-for="(item, index) in searchResults" :key="index" :item="item" @select="select" />
        </div>
        <!-- <div v-else-if="internalQuery === ''" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center">After a search, the results are displayed here.</div> -->
        <FilePick
          v-else-if="internalQuery === ''"
          v-model:query="internalQuery"
          style="grid-area: auto / auto / span 2 / span 3"
        />
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
import { setTmdbInSelection } from '../../state/actions/setTmdbInSelection';
import {toSubtitleSelection} from "../../../navigation/state/action/toSubtitleSelection";

export { close } from '@/util/close';
export { default as FilePick } from '@/file/pages/FilePick.vue';
export { default as ToolbarBackBtn } from '@/components/ToolbarBackBtn.vue';
export { default as PageLayout } from '@/components/PageLayout';
export { default as SearchBar } from './SearchBar.vue';
export { default as SearchEntry } from './SearchEntry.vue';
export { videoCount } from '@/video/state';

declare const props: {
  query?: string;
  contentTransitionName?: string; // default : ''
};

export const draggableAreaRef = ref(null);
useDraggableArea({ draggableAreaRef });

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

export const select = (tmdb: TmdbState) => {
  setTmdbInSelection(tmdb);
  toSubtitleSelection({
    tmdb_id: tmdb.tmdb_id,
    media_type: tmdb.media_type,
    searchQuery: internalQuery.value,
    contentTransitionName: 'content-navigate-deeper'
  });
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
    '. search-results .'
    '. spacer .';
  grid-template-rows: auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}
</style>
