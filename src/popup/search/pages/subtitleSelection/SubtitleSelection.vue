<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" class="subtitle-selection-toolbar--container--content">
        <ToolbarBackBtn style="grid-area: back" :back-fn="backFn" />
        <FilterBar v-model:filter="filter" style="grid-area: filter-bar" />
        <LanguageAccordion v-model:selected="language" style="grid-area: sub-lang-drop-down" />
      </div>
    </template>
    <template #content>
      <div v-if="!dataReady" style="line-height: 3; text-align: center">Loading subtitles...</div>
      <div v-else-if="filteredEntries.length" class="subtitle-selection-content--container">
        <div style="grid-area: search-results; display: grid">
          <div v-for="(item, index) in filteredEntries" :key="index" class="subtitle-selection-content--container--card">
            <div style="grid-area: header; overflow: hidden; text-overflow: ellipsis; color: black; font-weight: 500; font-family: 'Rubik', sans-serif; word-break; break-all;">
              {{ item.SubFileName }}
            </div>
            <div style="grid-area: content; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px; width: 100%; font-size: 1em; line-height: 1.8; font-weight: 300">
              <div style="grid-column: 1 / 2">subRating</div>
              <div style="grid-column: 2 / 3">{{ item.SubRating }}</div>
              <div style="grid-column: 1 / 2">subFormat</div>
              <div style="grid-column: 2 / 3">{{ item.SubFormat }}</div>
              <div style="grid-column: 1 / 2">subLang</div>
              <div style="grid-column: 2 / 3">{{ item.LanguageName }}</div>
            </div>
            <div style="grid-area: action; justify-self: end; align-self: center">
              <a class="knopf flat block end large" style="width: 100%" @click="select(item)">Select</a>
            </div>
            <div
              style="
                grid-column: 1/4;
                grid-row: 6/9;
                background-color: var(--card-actions-background-color);
                border-bottom-left-radius: var(--card-border-radius);
                border-bottom-right-radius: var(--card-border-radius);
              "
            />
          </div>
        </div>
      </div>
      <div v-else style="line-height: 3; text-align: center">
        <div>Sorry, no subtitle found.</div>
        <div>(╯°□°)╯︵ ┻━┻</div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, watch, computed } from 'vue';

export { default as ToolbarBackBtn } from '@/components/ToolbarBackBtn.vue';
export { default as LanguageAccordion } from './LanguageAccordion.vue';
export { default as FilterBar } from './FilterBar.vue';
export { default as PageLayout } from '@/components/PageLayout';

import { searchRequest } from './searchRequest';
import { selectOpenSubtitle, triggerDownload } from '@/search/state';
import { useDraggableArea } from '@/composables';
import { setState, setSrc } from '@/app/state';
import { OpensubtitlesState } from '@/search/state/types';
import { toHome, toSearch } from '@/navigation/state';

declare const props: {
  searchQuery: string;
  contentTransitionName: string; // default : ''
  tmdb_id: string;
  media_type: string;
};

export const draggableAreaRef = ref(null);
useDraggableArea({ draggableAreaRef: draggableAreaRef });

export const select = (openSubtitle) => {
  setState({ state: 'SELECTED' });
  setSrc({ src: 'SEARCH' });
  selectOpenSubtitle(openSubtitle);
  triggerDownload();
  toHome({
    contentTransitionName: 'content-navigate-select-to-home'
  });
};

export const backFn = (): void => {
  toSearch({
    contentTransitionName: 'content-navigate-shallow',
    query: props.searchQuery
  })
};

export const entries = ref<OpensubtitlesState[]>([]);
export const language = ref('en');
export const filter = ref('');
export const dataReady = ref(false);

export const filteredEntries = computed(() => entries.value.filter(({ SubFileName }) => filter.value === '' || SubFileName.toLowerCase().includes(filter.value.toLowerCase())));
export const triggerSearch = () =>
  searchRequest({ tmdb_id: props.tmdb_id, media_type: props.media_type, language: language.value }).then((result) => {
    dataReady.value = true;
    entries.value = result;
  });
triggerSearch();

watch(language, () => {
  dataReady.value = false;
  triggerSearch();
});
</script>

<style scoped>
/* plussub header */

.subtitle-selection-toolbar--container--content {
  display: grid;
  grid-template-areas:
    'back . .'
    'back filter-bar  filter-bar'
    'back . .'
    'back sub-lang-drop-down .'
    'back . .';
  grid-template-rows: 5px 30px 8px 25px 8px;
  grid-template-columns: auto 1fr;
}

.subtitle-selection-content--container {
  width: 100%;
  max-width: 100%;
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

.subtitle-selection-content--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-border-radius);
  display: grid;
  grid-template-areas:
    '.       .       .'
    '.       header  .'
    '.       .       .'
    '.       content .'
    '.       .       .'
    '.       .       .'
    '.       action  .'
    '.       .       .';
  grid-template-rows: 16px auto 16px 1fr 16px 8px 50px 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  min-width: 100%;
  margin-bottom: 8px;
}
</style>
<style>
/* plussub header */
.plussub-toolbar {
  --toolbar-height: auto;
}
</style>
