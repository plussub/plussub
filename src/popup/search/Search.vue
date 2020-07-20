<template>
  <div style="background-color: var(--primary); color: var(--onPrimary); width: 100%; height: 40px; box-shadow: var(--toolbar-shadow); display: flex;" class="toolbar">
    <toolbar-back-to-home style="height: 100%;" />
    <search-bar v-model:query="state.query" @on-search-results="onSearchResults" style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px;" />
  </div>
  <div class="search-content--container content">
    <div style="grid-area: search-results; display: flex; flex-wrap: wrap;">
      <div v-show="state.entries.length === 0" style="width: 100%;">
        <div v-if="state.query === ''">
          After a search, the results are displayed here.
        </div>
        <div v-else>
          No movie or tv series found.
        </div>
      </div>
      <search-entry v-for="item in state.entries" :item="item" @select="select"/>
    </div>
    <div style="grid-area: spacer;">&nbsp;</div>
  </div>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';
import SearchBar from '@/search/SearchBar.vue';
import SearchEntry from '@/search/SearchEntry.vue';
import { reactive } from 'vue';
import posterFallback from '@/res/posterFallback.png';
import Divider from '@/components/Divider';

export default {
  components: {
    ToolbarBackToHome,
    Divider,
    SearchBar,
    SearchEntry
  },
  setup() {
    const state = reactive({ query: "", entries: [] });

    return {
      static: {
        posterFallback
      },
      state,
      onSearchResults(entries) {
        state.entries = entries;
      },
      select({ id, media_type }) {
        this.$router.replace({ name: 'subtitleSelection', params: { tmdbId: id, mediaType: media_type } });
      },
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
