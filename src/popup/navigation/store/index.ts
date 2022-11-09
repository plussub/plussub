import MovieTvSearch from '@/search/pages/movieTv/MovieTvSearch.vue';
import SubtitleSearchForMovies from '@/search/pages/subtitleForMovies/SubtitleSearchForMovies.vue';
import SubtitleSearchForSeries from '@/search/pages/subtitleForSeries/SubtitleSearchForSeries.vue';
import Transcript from '@/transcript/pages/Transcript.vue';
import Settings from '@/settings/pages/Settings.vue';
import About from '@/about/pages/About.vue';
import Home from '@/home/pages/Home.vue';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface ToHomePayload {
  contentTransitionName: 'content-navigate-shallow' | 'content-navigate-select-to-home';
}

export interface ToSettingsPayload {
  contentTransitionName: 'content-navigate-deeper';
}

export interface ToAboutPayload {
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

type ViewNames =
  'HOME'
  | 'SETTINGS'
  | 'ABOUT'
  | 'MOVIE-TV-SEARCH'
  | 'SUBTITLE-SEARCH-FOR-MOVIES'
  | 'SUBTITLE-SEARCH-FOR-SERIES'
  | 'TRANSCRIPT';




export const useStore = defineStore('navigation', () => {
  const name = ref<ViewNames>('HOME');
  const params = ref<ToHomePayload | ToSettingsPayload | ToMovieTvSearchPayload | Record<string, string>>({});
  function to(newName: 'HOME', newParams: ToHomePayload): void
  function to(newName: 'SETTINGS', newParams: ToSettingsPayload): void
  function to(newName: 'ABOUT', newParams: ToAboutPayload): void
  function to(newName: 'MOVIE-TV-SEARCH', newParams: ToMovieTvSearchPayload): void
  function to(newName: 'SUBTITLE-SEARCH-FOR-MOVIES', newParams: ToSubtitleSearchForMoviesPayload): void
  function to(newName: 'SUBTITLE-SEARCH-FOR-SERIES', newParams: ToSubtitleSearchForSeriesPayload): void
  function to(newName: 'TRANSCRIPT', newParams: ToTranscriptPayload): void
  function to(newName: ViewNames, newParams: ToHomePayload | ToSettingsPayload | ToMovieTvSearchPayload): void {
    name.value = newName;
    params.value = newParams;
  }
  return {
    name,
    params,
    to,
    component: computed(() => {
      if (name.value === 'MOVIE-TV-SEARCH') {
        return MovieTvSearch;
      } else if (name.value === 'SUBTITLE-SEARCH-FOR-MOVIES') {
        return SubtitleSearchForMovies;
      } else if (name.value === 'SUBTITLE-SEARCH-FOR-SERIES') {
        return SubtitleSearchForSeries;
      } else if (name.value === 'TRANSCRIPT') {
        return Transcript;
      } else if (name.value === 'SETTINGS') {
        return Settings;
      } else if (name.value === 'ABOUT') {
        return About;
      } else {
        return Home;
      }
    })
  };
});