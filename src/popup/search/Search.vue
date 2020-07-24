<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div style="display: flex;">
        <toolbar-back-btn style="height: 100%;" />
        <search-bar v-model:query="state.query" v-model:loading="state.loading" @on-search-results="onSearchResults" style="flex-grow: 1; align-content: center;" />
      </div>
    </template>
    <template #content>
      <div class="search-content--container">
        <div v-if="state.entries.length" style="grid-area: search-results; display: flex; flex-wrap: wrap;">
          <search-entry v-for="item in state.entries" :item="item" @select="(event) => select(event)" />
        </div>
        <div v-else-if="state.query === ''" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center;">
          After a search, the results are displayed here.
        </div>
        <div v-else-if="!state.loading" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center;">
          <div>Sorry, no movies or tv shows found</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
        <div style="grid-area: spacer;">&nbsp;</div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import ToolbarBackBtn from '@/components/ToolbarBackBtn.vue';
import SearchBar from '@/search/SearchBar.vue';
import SearchEntry from '@/search/SearchEntry.vue';
import { reactive } from 'vue';
import posterFallback from '@/res/posterFallback.png';
import Divider from '@/components/Divider';
import PageLayout from '@/components/PageLayout';
import { write, snapshot } from '../../shared/appState';

export default {
  components: {
    ToolbarBackBtn,
    Divider,
    SearchBar,
    SearchEntry,
    PageLayout
  },
  props: {
    query: String,
    contentTransitionName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const state = reactive({ query: props.query ?? '', entries: [], loading: false });
    return {
      props,
      static: {
        posterFallback
      },
      state,
      onSearchResults(entries) {
        state.entries = entries;
      },
      select(item) {
        const ss = snapshot();

        write({
          ...ss,
          search: {
            ...ss.search,
            inSelectionTmdb: item
          }
        })
        this.$router.replace({ name: 'subtitleSelection', params: { tmdb_id: item.tmdb_id, media_type: item.media_type, searchQuery: state.query, contentTransitionName: 'content-navigate-deeper' } });
      }
    };
  }
};
</script>

<style scoped>
.search-content--container {
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
