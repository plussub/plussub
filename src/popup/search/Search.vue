<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div style="display: flex; height: 40px;">
        <toolbar-back-btn ref="draggableAreaRef" style="height: 100%;" @navigate="(event) => $emit('navigate', event)"/>
        <search-bar v-model:query="state.query" v-model:loading="state.loading" @on-search-results="onSearchResults" style="flex-grow: 1; align-content: center; z-index: 10000;" />
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
import {setSelection} from "@/search/setSelection";
import {useDraggableArea} from "@/composables";
import {ref} from "vue";

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
  setup(props, {emit}) {
    const draggableAreaRef = ref(null);
    useDraggableArea({draggableAreaRef});
    const state = reactive({ query: props.query ?? '', entries: [], loading: false });
    return {
      draggableAreaRef,
      props,
      static: {
        posterFallback
      },
      state,
      onSearchResults(entries) {
        state.entries = entries;
      },
      async select(item) {
        await setSelection({item});
        emit('navigate', {name: 'SUBTITLE-SELECTION', params: { tmdb_id: item.tmdb_id, media_type: item.media_type, searchQuery: state.query, contentTransitionName: 'content-navigate-deeper' }});
      }
    };
  }
};
</script>

<style scoped>/* plussub header */
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
