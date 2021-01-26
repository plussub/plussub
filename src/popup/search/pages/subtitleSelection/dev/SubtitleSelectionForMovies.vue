<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #content>
      <div class="w-full h-full grid relative justify-center subtitle-selection-content--container">
        <div style="grid-area: filter-bar" class="pt-3 pb-2 bg-primary-50">
          <InputField v-model="filter" placeholder="Filter subtitles" placeholder-icon="filter" class="px-2" />
          <Select v-model:selected="language" v-model:show="showLanguageSelection" :options="languageList" filter-placeholder="Filter languages" :filter-fn="languageFilter" class="px-3 mt-2">
            <template #currentSelected>
              <span>Subtitle language: {{ prettyLanguage }}</span>
            </template>
            <template #default="slotProps">
              <span>{{ slotProps.item.iso639Name }} ({{ slotProps.item.iso639_2 }})</span>
            </template>
          </Select>
        </div>
        <div v-show="showSelection" class="w-full h-full overflow-hidden bg-surface-700 bg-opacity-50 backdrop-filter-blur" style="grid-row: 3/5; grid-column: 1/4" />
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar :loading="!dataReady" class="w-full" />
        </div>
        <div v-if="filteredEntries.length" class="overflow-y-auto" style="grid-area: search-results">
          <div v-for="(item, index) in filteredEntries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
            <SubtitleEntryDev :item="item" @select="select" />
            <Divider class="border-surface-200" />
          </div>
        </div>
        <div v-else-if="dataReady" class="self-center text-center leading-loose" style="grid-area: search-results">
          <div>Sorry, no subtitle found.</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { searchQuery, SearchQueryResultEntry } from './searchQueryForMovies';
import { selectOpenSubtitle, setPreferredLanguage } from '@/search/state';
import { download } from './download';
import { setSrc, setState } from '@/app/state';
import { toHome, toSearch } from '@/navigation/state';

import { default as Select } from '@/components/Select.vue';
import { default as Divider } from '@/components/Divider.vue';
import { default as SubtitleEntryDev } from './SubtitleEntry.vue';
import { default as PageLayout } from '@/components/PageLayout.vue';
import { default as LoadingBar } from '@/components/LoadingBar.vue';
import { default as InputField } from '@/components/InputField.vue';
import { parse, setRaw } from '@/subtitle/state';
import languageList from '@/res/iso639List.json';
import { capitalizeFirst } from '@/util/string';

export default defineComponent({
  components: {
    InputField,
    LoadingBar,
    Select,
    Divider,
    SubtitleEntryDev,
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
    const entries = ref<SearchQueryResultEntry[]>([]);

    const language = ref<{ iso639_2: string; iso639Name: string }>(
      languageList.find((e) => e.iso639_2 === window.plusSub_subtitleSearch.value.preferredLanguage) ?? { iso639_2: 'en', iso639Name: 'English' }
    );
    const showLanguageSelection = ref(false);

    const filter = ref('');

    const dataReady = ref(false);

    const triggerSearch = () =>
      searchQuery({
        tmdb_id: props.tmdb_id,
        language: language.value.iso639_2
      }).then((result) => {
        dataReady.value = true;
        entries.value = result;
      });
    triggerSearch();

    watch([language], () => {
      dataReady.value = false;
      triggerSearch();
    });

    return {
      dataReady,
      filter,
      languageList,
      languageFilter: (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        return languageList.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(query) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      },
      language,
      prettyLanguage: computed(() => capitalizeFirst(language.value.iso639_2)),
      showLanguageSelection,
      showSelection: computed(() => showLanguageSelection.value),
      entries,
      filteredEntries: computed(() =>
        entries.value.filter(({ attributes }) => {
          if(filter.value === ''){
            return true;
          }
          return attributes.files[0].file_name?.toLowerCase().includes(filter.value.toLowerCase()) ?? false;
        })
      ),
      select: (openSubtitle: SearchQueryResultEntry) => {
        setState({ state: 'SELECTED' });
        setSrc({ src: 'SEARCH' });
        setPreferredLanguage(language.value.iso639_2);
        selectOpenSubtitle({
          format: openSubtitle.attributes.format ?? 'srt',
          languageName: openSubtitle.attributes.language,
          rating: openSubtitle.attributes.ratings.toString(),
          websiteLink: openSubtitle.attributes.url
        });

        download(openSubtitle)
          .then(({ raw, format }) => {
            setRaw({ raw, format, id: openSubtitle.attributes.files[0].file_name });
            parse();
          })
          .catch(() => setState({ state: 'ERROR' }));

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
