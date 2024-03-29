<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #toolbar>
      <Toolbar has-back :back-fn="backFn"/>
    </template>
    <template #content>
      <div class="w-full h-full grid relative justify-center subtitle-selection-content--container">
        <div style="grid-area: filter-bar" class="pt-3 pb-2 bg-primary-50">
          <div class="w-full flex pr-2">
            <div class="w-full">
              <InputField v-model="internalFilter" placeholder="Filter subtitles" placeholder-icon="filter" class="px-2" />
            </div>
            <OnlyHearingImpairedFilterButton v-model:only-hearing-impaired="internalOnlyHearingImpaired" />
          </div>
          <LanguageSelect v-model:selected="internalLanguage" v-model:show="showLanguageSelection" :list="store.contentLanguages"></LanguageSelect>
        </div>
        <div v-show="showSelection" class="w-full h-full overflow-hidden bg-surface-700 bg-opacity-50 backdrop-filter-blur" style="grid-row: 3/5; grid-column: 1/4" />
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar :loading="store.loading" class="w-full" />
        </div>
        <div v-if="store.filteredEntries.length" class="overflow-y-auto" style="grid-area: search-results">
          <div v-for="(item, index) in store.filteredEntries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
            <SubtitleSearchEntry :item="item" @select="select" />
            <Divider class="border-surface-200" />
          </div>
        </div>
        <div v-else-if="!store.loading" class="self-center text-center leading-loose" style="grid-area: search-results">
          <div>Sorry, no subtitle found.</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
/* eslint-disable vue/prop-name-casing -- Because props are binded with the api response*/
import { computed, defineComponent, onUnmounted, PropType, ref, watch } from 'vue';

import SubtitleSearchEntry from '@/search/components/SubtitleSearchEntry.vue';
import LanguageSelect from '@/language/components/LanguageSelect.vue';
import Toolbar from '@/toolbar/Toolbar.vue';

import Divider from '@/components/Divider.vue';
import PageLayout from '@/components/PageLayout.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import InputField from '@/components/InputField.vue';
import { SubtitleSearchResultData } from '@/search/__gen_gql';
import OnlyHearingImpairedFilterButton from '@/search/components/OnlyHearingImpairedFilterButton.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore } from './subtitleSearchForMoviesStore';

export default defineComponent({
  components: {
    OnlyHearingImpairedFilterButton,
    InputField,
    LanguageSelect,
    LoadingBar,
    Divider,
    SubtitleSearchEntry,
    PageLayout,
    Toolbar
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
    const store = useStore();
    const navigationStore = useNavigationStore();
    store.initialize();
    store.$patch({tmdb_id: props.tmdb_id});

    const showLanguageSelection = ref(false);
    const internalLanguage = ref(store.language);

    watch(internalLanguage, (language) => {
      store.$patch({language});
      store.triggerQuery();
    }, { immediate: true });

    const internalFilter = ref(store.filter);
    watch(internalFilter, (filter) => store.$patch({ filter }));

    const internalOnlyHearingImpaired = ref(store.onlyHearingImpaired);
    watch(internalOnlyHearingImpaired, (onlyHearingImpaired) => store.$patch({ onlyHearingImpaired }));

    onUnmounted(() => store.unmount());
    return {
      store,
      internalLanguage,
      internalFilter,
      internalOnlyHearingImpaired,
      showLanguageSelection,

      showSelection: computed(() => showLanguageSelection.value),
      select: async (openSubtitle: SubtitleSearchResultData) => {
        await store.select(openSubtitle, () => navigationStore.to("HOME", { contentTransitionName: 'content-navigate-select-to-home' }));
      },
      backFn: (): void =>
        navigationStore.to("MOVIE-TV-SEARCH", {
          contentTransitionName: 'content-navigate-shallow',
          query: props.searchQuery
        })
    };
  }
});
</script>

<style scoped>
.subtitle-selection-content--container {
  min-height: var(--content-min-height);
  max-height: 500px;
  grid-template-areas:
    'filter-bar'
    'loading'
    'search-results';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>
