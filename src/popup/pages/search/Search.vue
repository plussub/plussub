<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <ToolbarBackBtn style="height: 100%" @navigate="(event) => $emit('navigate', event)" />
        <SearchBar v-model:query="internalQuery" v-model:loading="loading" v-model:searchResults="searchResults" style="flex-grow: 1; align-content: center; z-index: 10000" />
      </div>
    </template>
    <template #content>
      <div class="search-content--container">
        <div v-if="searchResults.length" style="grid-area: search-results">
          <SearchEntry v-for="(item, index) in searchResults" :key="index" :item="item" @select="(event) => select(event)" />
        </div>
        <div v-else-if="internalQuery === ''" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center">After a search, the results are displayed here.</div>
        <div v-else-if="!loading" style="grid-area: search-results; line-height: 3; text-align: center; align-self: center">
          <div>Sorry, no movies or tv shows found</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
        <div style="grid-area: spacer">&nbsp;</div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { setSelection } from '@/search/setSelection';
import { useDraggableArea } from '@/composables';
import { ref } from 'vue';

export { default as ToolbarBackBtn } from '@/components/ToolbarBackBtn.vue';
export { default as PageLayout } from '@/components/PageLayout';
export { default as SearchBar } from '@/search/SearchBar.vue';
export { default as SearchEntry } from '@/search/SearchEntry.vue';

declare const props: {
  query?: string;
  contentTransitionName: string; // default : ''
};

export default {
  emits: ['navigate']
};

export const draggableAreaRef = ref(null);
useDraggableArea({ draggableAreaRef });

export const internalQuery = ref(props.query ?? '');
export const searchResults = ref([]);
export const loading = ref(false);

export const select = async (item) => {
  await setSelection({ item });
  emit('navigate', {
    name: 'SUBTITLE-SELECTION',
    params: {
      tmdb_id: item.tmdb_id,
      media_type: item.media_type,
      searchQuery: internalQuery,
      contentTransitionName: 'content-navigate-deeper'
    }
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
