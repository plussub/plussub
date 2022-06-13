<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back :back-fn="backFn">
    <template #content>
      <div class="w-full h-full grid relative justify-center subtitle-selection-content--container">
        <div style="grid-area: filter-bar" class="pt-3 pb-2 bg-primary-50">
          <div class="w-full flex pr-2">
            <div class="w-full">
              <InputField v-model="filter" placeholder="Filter subtitles" placeholder-icon="filter" class="px-2" />
            </div>
            <OnlyHearingImpairedFilterButton v-model:only-hearing-impaired="onlyHearingImpaired" />
          </div>
          <div class="w-full flex">
            <SeasonSelect v-model:selected="season" v-model:show="showSeasonSelection" :count="seasonCount"></SeasonSelect>
            <EpisodeSelect v-model:selected="episode" v-model:show="showEpisodeSelection" :count="episodeCount"></EpisodeSelect>
          </div>
          <LanguageSelect v-model:selected="language" v-model:show="showLanguageSelection"></LanguageSelect>
        </div>
        <div v-show="showSelection" class="w-full h-full overflow-hidden bg-surface-700 bg-opacity-50 backdrop-filter-blur" style="grid-row: 3/5; grid-column: 1/4" />
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar :loading="loading" class="w-full" />
        </div>
        <div v-if="filteredEntries.length" class="overflow-y-auto" style="grid-area: search-results">
          <div v-for="(item, index) in filteredEntries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
            <SubtitleSearchEntry :item="item" @select="select" />
            <Divider class="border-surface-200" />
          </div>
        </div>
        <div v-else-if="!loading" class="self-center text-center leading-loose" style="grid-area: search-results">
          <div>Sorry, no subtitle found.</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
/* eslint-disable vue/prop-name-casing -- Because props are binded with the api response*/

import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { searchQuery, Seasons, SubtitleSearchForSeriesQueryVariables, SubtitleSearchResultData } from './searchQuery';
import { ISO639 } from '@/search/store';
import { download } from '@/search/download';

import OnlyHearingImpairedFilterButton from '@/search/components/OnlyHearingImpairedFilterButton.vue';
import LanguageSelect from '@/components/LanguageSelect/LanguageSelect.vue';
import SeasonSelect from './SeasonSelect.vue';
import EpisodeSelect from './EpisodeSelect.vue';

import SubtitleSearchEntry from '@/search/components/SubtitleSearchEntry.vue';

import Divider from '@/components/Divider.vue';
import PageLayout from '@/components/PageLayout.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import InputField from '@/components/InputField.vue';
import { from, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { useUnmountObservable } from '@/composables';
import { useInjectStore } from '@/composables/useInjectStore';

export default defineComponent({
  components: {
    LanguageSelect,
    SeasonSelect,
    EpisodeSelect,
    OnlyHearingImpairedFilterButton,
    InputField,
    LoadingBar,
    Divider,
    SubtitleSearchEntry,
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
    const appStore = useInjectStore('appStore');
    const subtitleStore = useInjectStore('subtitleStore');
    const searchStore = useInjectStore('searchStore');
    const navigationStore = useInjectStore('navigationStore');
    const trackStore = useInjectStore('trackStore');

    const unmountObservable = useUnmountObservable();

    const filter = ref('');

    const language = ref<ISO639>(searchStore.getters.getPreferredLanguageAsIso639.value);
    const showLanguageSelection = ref(false);

    const seasons = ref<Omit<Seasons, "id">[]>([]);

    const season = ref(1);
    const showSeasonSelection = ref(false);

    const episode = ref(0);
    const showEpisodeSelection = ref(false);

    const setSetShowSelection = (apply: boolean, { language, season, episode }: { language: boolean; season: boolean; episode: boolean }) => {
      if (!apply) {
        return;
      }
      showLanguageSelection.value = language;
      showSeasonSelection.value = season;
      showEpisodeSelection.value = episode;
    };
    watch(showLanguageSelection, (show) => setSetShowSelection(show, { language: show, season: false, episode: false }));
    watch(showSeasonSelection, (show) => setSetShowSelection(show, { language: false, season: show, episode: false }));
    watch(showEpisodeSelection, (show) => setSetShowSelection(show, { language: false, season: false, episode: show }));

    const entries = ref<SubtitleSearchResultData[]>([]);

    const loading = ref(true);

    const searchQuerySubject = new Subject<SubtitleSearchForSeriesQueryVariables>();
    searchQuerySubject
      .pipe(
        tap(() => (loading.value = true)),
        switchMap((variables) => from(searchQuery(variables))),
        tap((result) => {
          loading.value = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          entries.value = result.subtitleSearch.data;
          seasons.value = result.seasons.seasons;
        }),
        takeUntil(unmountObservable)
      )
      .subscribe();

    watch(
      [language, season, episode],
      ([language, season, episode]) =>
        searchQuerySubject.next({
          language: language.iso639_2,
          tmdb_id: props.tmdb_id,
          season_number: season,
          episode_number: episode
        }),
      { immediate: true }
    );

    const onlyHearingImpaired = ref(false);

    return {
      filter,
      onlyHearingImpaired,

      language,
      showLanguageSelection,

      season,
      seasonCount: computed(() => seasons.value?.length ?? 0),
      showSeasonSelection,

      episode,
      episodeCount: computed(() => seasons.value?.find((s) => s.season_number === season.value)?.episode_count ?? 0),
      showEpisodeSelection,

      showSelection: computed(() => showLanguageSelection.value || showSeasonSelection.value || showEpisodeSelection.value),

      loading,
      entries,
      filteredEntries: computed(() =>
        entries.value.filter(({ attributes }) => {
          if (filter.value === '') {
            return onlyHearingImpaired.value ? attributes.hearing_impaired : true;
          }
          const intermediate = attributes.files[0].file_name?.toLowerCase().includes(filter.value.toLowerCase()) ?? false;
          return onlyHearingImpaired.value ? intermediate && attributes.hearing_impaired : intermediate;
        })
      ),
      select: (openSubtitle: SubtitleSearchResultData) => {
        appStore.actions.setState({ state: 'SELECTED' });
        appStore.actions.setSrc({ src: 'SEARCH' });
        searchStore.actions.setPreferredLanguage({ preferredLanguage: language.value.iso639_2 });
        searchStore.actions.selectOpenSubtitle({
          format: openSubtitle.attributes.format ?? 'srt',
          languageName: openSubtitle.attributes.language,
          rating: openSubtitle.attributes.ratings.toString(),
          websiteLink: openSubtitle.attributes.url
        });

        download(openSubtitle)
          .then(({ raw, format }) => {
            subtitleStore.actions.setRaw({
              raw,
              format,
              id: openSubtitle.attributes.files[0].file_name ?? "-",
              language: language.value.iso639_2
            });
            subtitleStore.actions.parse();
            trackStore.actions.track({ source: 'search-for-series', language: language.value.iso639_2 });
          })
          .catch(() => appStore.actions.setState({ state: 'ERROR' }));

        navigationStore.actions.toHome({ contentTransitionName: 'content-navigate-select-to-home' });
      },
      backFn: (): void =>
        navigationStore.actions.toMovieTvSearch({
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
