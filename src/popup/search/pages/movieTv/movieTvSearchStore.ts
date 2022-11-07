import { defineStore } from 'pinia';
import { useStore as useVideoStore } from '@/video/store';
import { useStore as useFileStore } from '@/file/store';
import { useStore as useAppStore } from '@/app/store';
import { useStore as useSubtitleStore } from '@/subtitle/store';
import { useStore as useTrackStore } from '@/track/store';
import { useStore as useSearchStore } from '@/search/store';
import { asyncScheduler, from, merge, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { searchQuery, VideoSearchQuery, VideoSearchResultEntry } from '@/search/pages/movieTv/searchQuery';
import { computed, ref } from 'vue';

export const useStore = defineStore('movieTvSearchStore', () => {
  const unmountSubject = new Subject<undefined>();
  const searchQuerySubject = new Subject<string>();
  const query = ref('');
  const loading = ref(true);
  const entries = ref<VideoSearchResultEntry[]>([]);
  const selected = ref({
    tmdb_id: '',
    media_type: ''
  });

  const searchQueryObservable = searchQuerySubject.pipe(
    map((q: string) => q.trim()),
    tap(() => (loading.value = true)),
    throttleTime(750, asyncScheduler, { trailing: true, leading: true }),
    switchMap((query: string) =>
      query !== ''
        ? from(searchQuery({ query }))
        : from(Promise.resolve({ videoSearch: { entries: [] }, query: '' }))
    ),
    tap((result: VideoSearchQuery & { query: string }) => {
      loading.value = false;
      entries.value = result.videoSearch.entries;
    })
  );

  const allObservables = merge(
    unmountSubject,
    searchQueryObservable,
    searchQuerySubject
  ).pipe(takeUntil(unmountSubject));

  return {
    query,
    loading,
    entries,
    selected,
    initialize() {
      allObservables.subscribe();
    },
    unmount() {
      unmountSubject.next(undefined);
    },
    triggerQuery() {
      searchQuerySubject.next(query.value);
    },
    selectEntry(entry: VideoSearchResultEntry) {
      const searchStore = useSearchStore();
      searchStore.setTmdbInSelection({
        tmdb_id: entry.tmdb_id,
        media_type: entry.media_type,
        poster_path: entry.poster_path ?? null,
        release_date: entry.release_date ?? '',
        title: entry.title,
        vote_average: entry.vote_average ?? 0
      });

      selected.value = {
        media_type: entry.media_type,
        tmdb_id: entry.tmdb_id
      };
    },
    highlightCurrentVideo() {
      useVideoStore().highlightCurrent();
    },
    removeHighlightFromVideo() {
      useVideoStore().removeHighlight();
    },
    async removeCurrentSelectedVideo() {
      await useVideoStore().removeCurrent();
    },
    async loadFile({ filename, result }: { filename: string, result: string }) {
      const fileStore = useFileStore();
      const appStore = useAppStore();
      const subtitleStore = useSubtitleStore();
      const videoStore = useVideoStore();
      const trackStore = useTrackStore();

      const resetAll = async () => {
        appStore.reset();
        fileStore.reset();
        subtitleStore.reset();
        await videoStore.removeCurrent();
      };

      fileStore.$patch({ filename });
      appStore.$patch({ state: 'SELECTED', src: 'FILE' });
      const format = fileStore.getFormatFromFilename(filename);
      if (!format) {
        await resetAll();
        return;
      }
      subtitleStore.setRaw({ raw: result, format, id: filename, language: null });

      try {
        subtitleStore.parse();
      } catch (e) {
        await resetAll();
        return;
      }

      await trackStore.track({ source: 'file', language: '' });
    },
    existsMultipleVideos: computed(() => useVideoStore().count > 1),
    onlySingleVideo: computed(() => useVideoStore().count === 1),
    existsVideoName: computed(() => useVideoStore().videoName !== ''),
    videoName: computed(() => useVideoStore().videoName),
    selectedNavigateTo: computed(() => selected.value.media_type === 'movie' ? 'SUBTITLE-SEARCH-FOR-MOVIES' as const : 'SUBTITLE-SEARCH-FOR-SERIES' as const),
    selectedNavigatePayload: computed(() => {
      return {
        tmdb_id: selected.value.tmdb_id,
        media_type: selected.value.media_type,
        searchQuery: query.value,
        contentTransitionName: 'content-navigate-deeper' as const
      };
    })
  };
});