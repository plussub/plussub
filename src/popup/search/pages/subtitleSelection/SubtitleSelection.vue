<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #toolbar>
      <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Pick Subtitle</div>
    </template>
    <template #content>
      <div class="subtitle-selection-content--container">
        <div style="grid-area: filter-bar">
          <FilterBar v-model:filter="filter" />
          <LanguageAccordion v-model:selected="language" v-model:showLanguageSelection="showLanguageSelection" style="margin-top: 4px"/>
          <Divider style="margin-top: 4px" />
        </div>
        <div v-show="showLanguageSelection" style="grid-row: 3/5; grid-column: 1/4; background-color: #29292936; top: 40px; width: 100%; height: 100%; overflow-y: hidden; backdrop-filter: blur(1px)"></div>
        <div v-if="!dataReady" style="grid-area: search-results; line-height: 3; text-align: center; overflow-y: auto">Loading subtitles...</div>
        <div v-else-if="filteredEntries.length" style="grid-area: search-results; display: grid; overflow-y: auto">
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
        <div v-else style="grid-area: search-results; line-height: 3; text-align: center">
          <div>Sorry, no subtitle found.</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { computed, ref, watch } from 'vue';
import { searchRequest } from './searchRequest';
import { selectOpenSubtitle, triggerDownload } from '@/search/state';
import { setSrc, setState } from '@/app/state';
import { OpensubtitlesState } from '@/search/state/types';
import { toHome, toSearch } from '@/navigation/state';

export { default as LanguageAccordion } from './LanguageAccordion.vue';
export { default as Divider } from '@/components/Divider';
export { default as FilterBar } from './FilterBar.vue';
export { default as PageLayout } from '@/components/PageLayout';

declare const props: {
  searchQuery: string;
  contentTransitionName: string; // default : ''
  tmdb_id: string;
  media_type: string;
};

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
  });
};

export const entries = ref<OpensubtitlesState[]>([]);
export const language = ref('en');
export const showLanguageSelection = ref(false);
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
.subtitle-selection-content--container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. .              .'
    '. filter-bar     .'
    '. .              .'
    '. search-results .';
  grid-template-rows: 16px auto 16px 1fr;
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
