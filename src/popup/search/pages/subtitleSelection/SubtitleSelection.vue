<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #content>
      <div class="pt-2 w-full h-full grid relative justify-center subtitle-selection-content--container">
        <div style="grid-area: filter-bar">
          <FilterBar v-model:filter="filter" class="px-2" />
          <LanguageAccordion v-model:selected="language" v-model:showLanguageSelection="showLanguageSelection" class="px-3 mt-2" />
        </div>
        <div v-show="showLanguageSelection" class="w-full h-full overflow-hidden bg-surface-700 bg-opacity-50 backdrop-filter-blur" style="grid-row: 3/5; grid-column: 1/4" />
        <div v-if="!dataReady" class="self-center text-center leading-loose" style="grid-area: search-results">Loading subtitles...</div>
        <div v-else-if="filteredEntries.length" class="overflow-y-auto" style="grid-area: search-results">
          <div v-for="(item, index) in filteredEntries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
            <SubtitleEntry :item="item" @select="select" />
            <Divider class="border-surface-200" />
          </div>
        </div>
        <div v-else class="self-center text-center leading-loose" style="grid-area: search-results">
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
  min-height: 300px;
  max-height: 500px;
  grid-template-areas:
    'filter-bar'
    '.'
    'search-results';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: 1fr;
}
</style>
