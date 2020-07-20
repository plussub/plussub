<template>
  <div class="subtitle-selection-toolbar--container toolbar">
    <toolbar-back-to-home style="grid-area: back;" />
    <filter-bar v-model:filter="state.filter" style="grid-area: filter-bar;" />
    <language-accordion v-model:selected="state.selectedLanguage" style="grid-area: sub-lang-drop-down;" />
  </div>
  <template v-if="dataReady">
    <div class="subtitle-selection-content--container content">
      <div style="grid-area: search-results; display: grid;">
        <div v-for="item in state.filteredEntries" class="subtitle-selection-content--container--card">
          <div style="grid-area: card-header; overflow: hidden; text-overflow: ellipsis;">{{ item.SubFileName }}</div>
          <div style="grid-area: card-content; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px; width: 100%; font-size: 0.75em; line-height: 1.6;">
            <div style="grid-column: 1 / 2">Rating:</div><div style="grid-column: 2 / 3"> {{ item.SubRating }}</div>
            <div style="grid-column: 1 / 2">Format:</div><div style="grid-column: 2 / 3"> {{ item.SubFormat }}</div>
          </div>
          <div style="grid-area: card-divider; align-self: end;">
            <divider />
          </div>
          <div style="grid-area: card-action; justify-self: end;">
            <a class="knopf flat block end small" style="width: 100%;" @click="select(item)">Select</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="content">Loading subtitles...</div>
  </template>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';
import LanguageAccordion from '@/subtitleSelection/LanguageAccordion.vue';
import FilterBar from '@/subtitleSelection/filterBar';
import { reactive, ref, watch } from 'vue';
import { searchRequest } from '@/subtitleSelection/searchRequest';
import Divider from '@/components/Divider';

export default {
  components: {
    ToolbarBackToHome,
    LanguageAccordion,
    FilterBar,
    Divider
  },
  props: {
    tmdbId: String,
    mediaType: String
  },
  setup(props) {
    const state = reactive({ entries: [], filteredEntries: [], selectedLanguage: 'en', filter: '' });
    let dataReady = ref(false);

    const setFiltered = () => {
      state.filteredEntries = state.entries.filter(({ SubFileName }) => {
        if (state.filter === '') {
          return true;
        }
        return SubFileName.toLowerCase().includes(state.filter.toLowerCase());
      });
    };

    const triggerSearch = () => searchRequest({ ...props, language: state.selectedLanguage }).then((result) => {
      dataReady.value = true;
      state.entries = result.data.subtitleSearch.entries;
      setFiltered();
    });

    triggerSearch();

    watch(() => state.filter, setFiltered);
    watch(() => state.selectedLanguage, () => {
      dataReady.value = false;
      triggerSearch();
    });

    return {
      dataReady,
      state,
      props
    };
  }
};
</script>

<style scoped>
.subtitle-selection-toolbar--container {
  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: 100%;
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas:
    'back . . .'
    'back . filter-bar .'
    'back . . .'
    'back . sub-lang-drop-down .'
    'back . . .';
  grid-template-rows: 16px 25px 16px 25px 8px;
  grid-template-columns: auto 8px 1fr 16px;
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
  display: grid;
  grid-template-areas:
    '. . .'
    '. card-header .'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: 8px auto 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  min-width: 100%;
  margin-bottom: 8px;
}
</style>
