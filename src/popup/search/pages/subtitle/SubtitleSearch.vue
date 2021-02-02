<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #content>
      <div class="w-full h-full grid relative justify-center subtitle-selection-content--container">
        <div style="grid-area: filter-bar" class="pt-3 pb-2 bg-primary-50">
          <InputField v-model="filter" placeholder="Filter subtitles" placeholder-icon="filter" class="px-2" />
          <LanguageSelect v-model:selected="language" v-model:show="showLanguageSelection"></LanguageSelect>
        </div>
        <div v-show="showSelection" class="w-full h-full overflow-hidden bg-surface-700 bg-opacity-50 backdrop-filter-blur" style="grid-row: 3/5; grid-column: 1/4" />
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar :loading="!dataReady" class="w-full" />
        </div>
        <div v-if="filteredEntries.length" class="overflow-y-auto" style="grid-area: search-results">
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
import { computed, defineComponent, inject, PropType, ref, watch } from 'vue';
import { LegacySubtitleSearch_legacySubtitleSearch_entries, searchQuery } from './searchQuery';
import { download } from './download';
import { SearchStore } from '@/search/store';
import { toHome, toSearch } from '@/navigation/state';

import Divider from '@/components/Divider.vue';
import LanguageSelect from '@/search/components/LanguageSelect.vue';
import SubtitleEntry from './SubtitleSearchEntry.vue';

import PageLayout from '@/components/PageLayout.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import InputField from '@/components/InputField.vue';
import languageList from '@/res/iso639List.json';
import { AppStore } from '@/app/store';
import {SubtitleStore} from "@/subtitle/store";

export default defineComponent({
  components: {
    LanguageSelect,
    InputField,
    LoadingBar,
    Divider,
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
    const appStore = inject<AppStore>('appStore');
    const searchStore = inject<SearchStore>('searchStore');
    const subtitleStore = inject<SubtitleStore>('subtitleStore');

    if (!appStore || !searchStore || !subtitleStore) {
      throw new Error('inject failed');
    }

    const entries = ref<LegacySubtitleSearch_legacySubtitleSearch_entries[]>([]);
    const language = ref<{ iso639_2: string; iso639Name: string }>(
      languageList.find((e) => e.iso639_2 === searchStore.state.value.preferredLanguage) ?? {
        iso639_2: 'en',
        iso639Name: 'English'
      }
    );
    const showLanguageSelection = ref(false);

    const filter = ref('');
    const dataReady = ref(false);

    const triggerSearch = () =>
      searchQuery({
        tmdb_id: props.tmdb_id,
        media_type: props.media_type,
        language: language.value.iso639_2
      }).then((result) => {
        dataReady.value = true;
        entries.value = result.legacySubtitleSearch.entries;
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
      showLanguageSelection,
      entries,
      filteredEntries: computed(() => entries.value.filter(({ SubFileName }) => filter.value === '' || SubFileName.toLowerCase().includes(filter.value.toLowerCase()))),
      showSelection: computed(() => showLanguageSelection.value),

      select: (openSubtitle: LegacySubtitleSearch_legacySubtitleSearch_entries) => {
        appStore.actions.setState({ state: 'SELECTED' });
        appStore.actions.setSrc({ src: 'SEARCH' });
        searchStore.actions.setPreferredLanguage({ preferredLanguage: language.value.iso639_2 });
        searchStore.actions.selectOpenSubtitle({
          format: openSubtitle.SubFormat,
          languageName: openSubtitle.LanguageName,
          rating: openSubtitle.SubRating.toString(),
          websiteLink: openSubtitle.SubtitlesLink
        });
        appStore.actions.setState({ state: 'DOWNLOADING' });
        download(openSubtitle)
          .then(({ raw, format }) => {
            subtitleStore.actions.setRaw({ raw, format, id: openSubtitle.SubHash });
            subtitleStore.actions.parse();
          })
          .catch(() => appStore.actions.setState({ state: 'ERROR' }));
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
    'loading'
    'search-results';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>