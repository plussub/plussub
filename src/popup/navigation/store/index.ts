import {computed, ComputedRef, ref} from 'vue';

export type NavigationState = {
  name: 'HOME' | 'SETTINGS' | 'MOVIE-TV-SEARCH' | 'SUBTITLE-SEARCH-FOR-MOVIES' | 'SUBTITLE-SEARCH-FOR-SERIES' | 'TRANSCRIPT';
  params: any;
};

export interface ToHomePayload {
  contentTransitionName: 'content-navigate-shallow' | 'content-navigate-select-to-home';
}

export interface ToSettingsPayload {
  contentTransitionName: 'content-navigate-deeper';
}

export interface ToMovieTvSearchPayload {
  contentTransitionName: 'content-navigate-deeper' | 'content-navigate-shallow';
  query?: string;
}

export interface ToSubtitleSearchPayload {
  tmdb_id: string;
  media_type: string;
  searchQuery: string;
  contentTransitionName: 'content-navigate-deeper';
}

export type ToSubtitleSearchForMoviesPayload = ToSubtitleSearchPayload
export type ToSubtitleSearchForSeriesPayload = ToSubtitleSearchPayload

export interface ToTranscriptPayload {
  contentTransitionName: 'content-navigate-deeper';
}

export interface NavigationStore {
  state: ComputedRef<NavigationState>;
  actions: {
    toHome: (params?: ToHomePayload) => void;
    toSettings: (params?: ToSettingsPayload) => void;
    toMovieTvSearch: (params?: ToMovieTvSearchPayload) => void;
    toSubtitleSearchForMovies: (params: ToSubtitleSearchForMoviesPayload) => void;
    toSubtitleSearchForSeries: (params: ToSubtitleSearchForSeriesPayload) => void;
    toTranscript: (params?: ToTranscriptPayload) => void;
  };
}

export const init = (): NavigationStore => {
  const state = ref<NavigationState>({
    name: 'HOME',
    params: {}
  });

  return {
    state: computed(() => state.value),
    actions: {
      toHome: (params: ToHomePayload = {contentTransitionName: 'content-navigate-shallow'}): void => {
        state.value = {name: 'HOME', params};
      },
      toSettings: (params: ToSettingsPayload =  { contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'SETTINGS', params};
      },
      toMovieTvSearch: (params: ToMovieTvSearchPayload = {contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'MOVIE-TV-SEARCH', params};
      },
      toSubtitleSearchForMovies: (params: ToSubtitleSearchForMoviesPayload): void => {
        state.value = {name: 'SUBTITLE-SEARCH-FOR-MOVIES', params};
      },
      toSubtitleSearchForSeries: (params: ToSubtitleSearchForSeriesPayload): void => {
        state.value = {name: 'SUBTITLE-SEARCH-FOR-SERIES', params};
      },
      toTranscript: (params: ToTranscriptPayload = {contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'TRANSCRIPT', params};
      }
    }
  };
};
