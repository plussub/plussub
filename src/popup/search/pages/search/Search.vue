<template>
  <PageLayout :content-transition-name="contentTransitionName" :has-back="videoCount > 1" :back-fn="backFn">
    <template #toolbar>
      <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Search Movie or Series</div>
    </template>
    <template #content>
      <div class="search-content--container">
        <div style="grid-area: search-bar">
          <SearchBar v-model:query="internalQuery" v-model:loading="loading" />
          <Divider style="margin-top: 4px" />
        </div>
        <div v-if="searchResults.length" style="grid-area: search-results; overflow-y: auto">
          <div v-for="(item, index) in searchResults" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" />
            <SearchEntry :item="item" @select="select" />
            <Divider style="grid-column: 1/3" />
          </div>
        </div>
        <div v-else-if="internalQuery === ''" style="grid-area: search-results; grid-column: 2/3; grid-row: 4/5">
          <FilePick v-model:query="internalQuery" />
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

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { searchRequest } from './searchRequest';
import { debounce } from '@/composables';
import { setTmdbInSelection, TmdbState } from '@/search/state';
import { setCurrentSelectedSrc, toHome, toSubtitleSelection } from '@/navigation/state';
import { videoCount } from '@/video/state';

import { default as FilePick } from '@/file/components/FilePick.vue';
import { default as PageLayout } from '@/components/PageLayout.vue';
import { default as Divider } from '@/components/Divider.vue';
import { default as SearchBar } from './SearchBar.vue';
import { default as SearchEntry } from './SearchEntry.vue';

export default defineComponent({
  components: {
    FilePick,
    PageLayout,
    Divider,
    SearchBar,
    SearchEntry
  },
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const internalQuery = ref(props.query ?? '');
    const searchResults = ref([]);
    const loading = ref(false);

    const { fn: req } = debounce<TmdbState[]>({
      fn: searchRequest,
      timeout: 1500,
      resultRef: searchResults,
      loadingRef: loading
    });

    watch(internalQuery, (query) => req(query), { immediate: true });

    return {
      internalQuery,
      searchResults,
      loading,
      videoCount,
      select: (tmdb: TmdbState): void => {
        setTmdbInSelection(tmdb);
        toSubtitleSelection({
          tmdb_id: tmdb.tmdb_id,
          media_type: tmdb.media_type,
          searchQuery: internalQuery.value,
          contentTransitionName: 'content-navigate-deeper'
        });
      },
      backFn: (): void => {
        setCurrentSelectedSrc(null);
        toHome();
      }
    };
  }
});
</script>

<style scoped>

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
    'search-results  search-results search-results'
    '. .              .';
  grid-template-rows: 16px auto 16px 1fr 16px;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}
</style>
