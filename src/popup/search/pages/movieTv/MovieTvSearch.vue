<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar :has-back="videoCount > 1" :back-fn="backFn">
        <a v-if="videoCount === 1" class="self-center pr-4" @click="toSettings()">
          <FontAwesomeIcon icon="cog" class="h-icon hover:text-on-primary-hover-500"></FontAwesomeIcon>
        </a>
      </Toolbar>
    </template>
    <template #content>
      <div class="w-full h-full grid relative justify-center search-content--container">
        <div style="grid-area: search-bar" class="pt-3 pb-2 bg-primary-50">
          <InputField v-model="internalQuery" class="px-2" placeholder-icon="search" placeholder="Search movie or series" />
          <div v-show="videoName !== ''" class="px-5 mt-2 leading-normal text-sm">
            <div class="italic">Search Suggestion</div>
            <a class="relative text-primary-700 hover:underline italic" @click="changeQueryToSuggested">{{ videoName }}</a>
          </div>
        </div>
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar :loading="loading && internalQuery !== ''" class="w-full" />
        </div>
        <div v-if="entries.length" class="overflow-y-auto" style="grid-area: search-results">
          <div v-for="(item, index) in entries" :key="index">
            <Divider v-if="index === 0" style="grid-column: 1/3" class="border-surface-200" />
            <MovieTvSearchEntry :item="item" @select="select" />
            <Divider style="grid-column: 1/3" class="border-surface-200" />
          </div>
        </div>
        <div v-else-if="internalQuery === ''" style="grid-area: search-results; grid-column: 1/2; grid-row: 3/4" class="my-4">
          <FilePick v-model:query="internalQuery" />
        </div>
        <div v-else-if="!loading" class="self-center text-center leading-loose" style="grid-area: search-results">
          <div>Sorry, no movies or tv shows found</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { searchQuery, VideoSearchResultEntry } from './searchQuery';

import FilePick from '@/file/components/FilePick.vue';
import PageLayout from '@/components/PageLayout.vue';
import Divider from '@/components/Divider.vue';
import MovieTvSearchEntry from './MovieTvSearchEntry.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import InputField from '@/components/InputField.vue';
import { asyncScheduler, from, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { useUnmountObservable } from '@/composables';
import { useInjectStore } from '@/composables/useInjectStore';
import Toolbar from '@/Toolbar/Toolbar.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon,
    Toolbar,
    InputField,
    LoadingBar,
    FilePick,
    PageLayout,
    Divider,
    MovieTvSearchEntry
  },
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const searchStore = useInjectStore('searchStore');
    const navigationStore = useInjectStore('navigationStore');
    const videoStore = useInjectStore('videoStore');

    const unmountObservable = useUnmountObservable();

    const internalQuery = ref(props.query ?? '');
    const loading = ref(true);
    const entries = ref<VideoSearchResultEntry[]>([]);

    const searchQuerySubject = new Subject<string>();
    searchQuerySubject
      .pipe(
        map((q) => q.trim()),
        tap(() => (loading.value = true)),
        throttleTime(750, asyncScheduler, {
          trailing: true,
          leading: true
        }),
        switchMap((query) =>
          query !== ''
            ? from(searchQuery({ query }))
            : from(
                Promise.resolve({
                  videoSearch: { entries: [] },
                  query: ''
                })
              )
        ),
        tap((result) => {
          if (result.query === internalQuery.value.trim()) {
            loading.value = false;
            entries.value = result.videoSearch.entries;
          }
        }),
        takeUntil(unmountObservable)
      )
      .subscribe();

    watch(internalQuery, (query) => searchQuerySubject.next(query), { immediate: true });

    return {
      internalQuery,
      loading,
      entries,

      videoCount: videoStore.getters.count,
      videoName: videoStore.getters.videoName,
      toSettings: navigationStore.actions.toSettings,
      changeQueryToSuggested: () => (internalQuery.value = videoStore.getters.videoName.value),
      select: (tmdb: VideoSearchResultEntry): void => {
        searchStore.actions.setTmdbInSelection({
          tmdb_id: tmdb.tmdb_id,
          media_type: tmdb.media_type,
          poster_path: tmdb.poster_path!,
          release_date: tmdb.release_date ?? '',
          title: tmdb.title,
          vote_average: tmdb.vote_average ?? 0
        });
        const to = tmdb.media_type === 'movie' ? navigationStore.actions.toSubtitleSearchForMovies : navigationStore.actions.toSubtitleSearchForSeries;
        to({
          tmdb_id: tmdb.tmdb_id,
          media_type: tmdb.media_type,
          searchQuery: internalQuery.value,
          contentTransitionName: 'content-navigate-deeper'
        });
      },
      backFn: async (): Promise<void> => {
        await videoStore.actions.removeCurrent();
        navigationStore.actions.toHome();
      }
    };
  }
});
</script>

<style scoped>
.search-content--container {
  min-height: 300px;
  max-height: 500px;
  grid-template-areas:
    'search-bar'
    'loading'
    'search-results';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>
