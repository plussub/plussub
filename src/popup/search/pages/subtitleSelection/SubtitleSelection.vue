<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #toolbar>
      <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Pick Subtitle</div>
    </template>
    <template #content>
      <div class="subtitle-selection-content--container">
        <div style="grid-area: filter-bar">
          <FilterBar v-model:filter="filter" />
          <LanguageAccordion v-model:selected="language" v-model:showLanguageSelection="showLanguageSelection" style="margin-top: 4px" />
          <Divider style="margin-top: 4px" />
        </div>
        <div
          v-show="showLanguageSelection"
          style="grid-row: 3/5; grid-column: 1/4; background-color: #29292936; top: 40px; width: 100%; height: 100%; overflow-y: hidden; backdrop-filter: blur(1px)"
        ></div>
        <div v-if="!dataReady" style="grid-area: search-results; line-height: 3; text-align: center; overflow-y: auto">Loading subtitles...</div>
        <div v-else-if="filteredEntries.length" style="grid-area: search-results; overflow-y: auto">
          <div v-for="(item, index) in filteredEntries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" />
            <SubtitleEntry :item="item" @select="select" />
            <Divider />
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

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { searchRequest } from './searchRequest';
import { OpensubtitlesState, selectOpenSubtitle, triggerDownload } from '@/search/state';
import { setSrc, setState } from '@/app/state';
import { toHome, toSearch } from '@/navigation/state';

import { default as LanguageAccordion } from './LanguageAccordion.vue';
import { default as Divider } from '@/components/Divider.vue';
import { default as FilterBar } from './FilterBar.vue';
import { default as SubtitleEntry } from './SubtitleEntry.vue';
import { default as PageLayout } from '@/components/PageLayout.vue';

export default defineComponent({
  components: {
    LanguageAccordion,
    Divider,
    FilterBar,
    SubtitleEntry,
    PageLayout
  },
  props: {
    searchQuery: {
      type: String as PropType<string>,
      required: true
    },
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    tmdb_id: {
      type: String as PropType<string>,
      required: true
    },
    media_type: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const entries = ref<OpensubtitlesState[]>([]);
    const language = ref('en');
    const filter = ref('');
    const dataReady = ref(false);

    const triggerSearch = () =>
      searchRequest({
        tmdb_id: props.tmdb_id,
        media_type: props.media_type,
        language: language.value
      }).then((result) => {
        dataReady.value = true;
        entries.value = result;
      });
    triggerSearch();

    watch(language, () => {
      dataReady.value = false;
      triggerSearch();
    });

    return {
      dataReady,
      filter,
      language,
      showLanguageSelection: ref(false),
      entries,
      filteredEntries: computed(() => entries.value.filter(({ SubFileName }) => filter.value === '' || SubFileName.toLowerCase().includes(filter.value.toLowerCase()))),
      select: (openSubtitle) => {
        setState({ state: 'SELECTED' });
        setSrc({ src: 'SEARCH' });
        selectOpenSubtitle(openSubtitle);
        triggerDownload();
        toHome({
          contentTransitionName: 'content-navigate-select-to-home'
        });
      },
      backFn: (): void =>
        toSearch({
          contentTransitionName: 'content-navigate-shallow',
          query: props.searchQuery
        })
    };
  }
});
</script>

<style scoped>

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
    'search-results search-results search-results';
  grid-template-rows: 16px auto 16px 1fr;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}
</style>
<style>

.plussub-toolbar {
  --toolbar-height: auto;
}
</style>
