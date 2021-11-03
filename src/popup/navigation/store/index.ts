import {computed, ComputedRef, ref} from 'vue';
import MovieTvSearch from "@/search/pages/movieTv/MovieTvSearch.vue";
import SubtitleSearchForMovies from "@/search/pages/subtitleForMovies/SubtitleSearchForMovies.vue";
import SubtitleSearchForSeries from "@/search/pages/subtitleForSeries/SubtitleSearchForSeries.vue";
import Transcript from "@/subtitle/pages/Transcript.vue";
import Settings from "@/settings/pages/Settings.vue";
import Home from "@/home/pages/Home.vue";

export type NavigationState = {
  name: 'HOME' | 'SETTINGS' | 'MOVIE-TV-SEARCH' | 'SUBTITLE-SEARCH-FOR-MOVIES' | 'SUBTITLE-SEARCH-FOR-SERIES' | 'TRANSCRIPT';
  params: unknown;
  component: unknown;
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

  const component = computed(() => {
    if (state.value.name === 'MOVIE-TV-SEARCH') {
      return MovieTvSearch;
    } else if (state.value.name === 'SUBTITLE-SEARCH-FOR-MOVIES') {
      return SubtitleSearchForMovies;
    } else if (state.value.name === 'SUBTITLE-SEARCH-FOR-SERIES') {
      return SubtitleSearchForSeries;
    } else if (state.value.name === 'TRANSCRIPT') {
      return Transcript;
    } else if (state.value.name === 'SETTINGS') {
      return Settings;
    } else {
      return Home;
    }
  });

  const state = ref<NavigationState>({
    name: 'HOME',
    params: {},
    component
  });

  return {
    state: computed(() => state.value),
    actions: {
      toHome: (params: ToHomePayload = {contentTransitionName: 'content-navigate-shallow'}): void => {
        state.value = {name: 'HOME', params, component};
      },
      toSettings: (params: ToSettingsPayload =  { contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'SETTINGS', params, component};
      },
      toMovieTvSearch: (params: ToMovieTvSearchPayload = {contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'MOVIE-TV-SEARCH', params, component};
      },
      toSubtitleSearchForMovies: (params: ToSubtitleSearchForMoviesPayload): void => {
        state.value = {name: 'SUBTITLE-SEARCH-FOR-MOVIES', params, component};
      },
      toSubtitleSearchForSeries: (params: ToSubtitleSearchForSeriesPayload): void => {
        state.value = {name: 'SUBTITLE-SEARCH-FOR-SERIES', params, component};
      },
      toTranscript: (params: ToTranscriptPayload = {contentTransitionName: 'content-navigate-deeper'}): void => {
        state.value = {name: 'TRANSCRIPT', params, component};
      }
    }
  };
};
