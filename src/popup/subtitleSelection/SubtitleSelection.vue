<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" class="subtitle-selection-toolbar--container--content">
        <toolbar-back-btn style="grid-area: back" :back-fn="backFn" />
        <filter-bar v-model:filter="filter" style="grid-area: filter-bar" />
        <language-accordion v-model:selected="language" style="grid-area: sub-lang-drop-down" />
      </div>
    </template>
    <template #content>
      <div v-if="!dataReady" style="line-height: 3; text-align: center">Loading subtitles...</div>
      <div v-else-if="filteredEntries.length" class="subtitle-selection-content--container">
        <div style="grid-area: search-results; display: grid">
          <div v-for="item in filteredEntries" class="subtitle-selection-content--container--card">
            <div style="grid-area: header; overflow: hidden; text-overflow: ellipsis; color: black; font-weight: 500; font-family: 'Rubik', sans-serif">
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
  </page-layout>
</template>

<script>
import ToolbarBackBtn from '@/components/ToolbarBackBtn.vue';
import LanguageAccordion from '@/subtitleSelection/LanguageAccordion.vue';
import FilterBar from '@/subtitleSelection/FilterBar';
import { ref, watch, computed } from 'vue';
import { searchRequest } from '@/subtitleSelection/searchRequest';
import Divider from '@/components/Divider';
import PageLayout from '@/components/PageLayout';
import { setSelection } from '@/subtitleSelection/setSelection';
import { triggerDownload } from '@/subtitleSelection/triggerDownload';
import { useDraggableArea } from '@/composables';

export default {
  components: {
    ToolbarBackBtn,
    LanguageAccordion,
    FilterBar,
    Divider,
    PageLayout
  },
  emits: ['navigate'],
  props: {
    searchQuery: String,
    contentTransitionName: {
      type: String,
      default: ''
    },
    tmdb_id: String,
    media_type: String
  },
  setup(props, { emit }) {
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef: draggableAreaRef });

    const entries = ref([]);
    const language = ref('en');
    const filter = ref('');
    const dataReady = ref(false);

    const filteredEntries = computed(() => entries.value.filter(({ SubFileName }) => filter.value === '' || SubFileName.toLowerCase().includes(filter.value.toLowerCase())));

    const triggerSearch = () =>
      searchRequest({ ...props, language: language.value }).then((result) => {
        dataReady.value = true;
        entries.value = result.data.subtitleSearch.entries;
      });

    triggerSearch();

    watch(language, () => {
      dataReady.value = false;
      triggerSearch();
    });

    return {
      draggableAreaRef,
      dataReady,
      language,
      filter,
      filteredEntries,
      backFn() {
        emit('navigate', {
          name: 'SEARCH',
          params: { query: props.searchQuery, contentTransitionName: 'content-navigate-shallow' }
        });
      },
      async select(item) {
        await setSelection({ item });
        triggerDownload();
        emit('navigate', { name: 'HOME', params: { contentTransitionName: 'content-navigate-select-to-home' } });
      }
    };
  }
};
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
/* #plussubShadow  */
.toolbar {
  --toolbar-height: auto;
}
</style>
