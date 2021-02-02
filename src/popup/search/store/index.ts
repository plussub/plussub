import {computed, ComputedRef, Ref, ref} from 'vue';
import { set as storageSet } from 'storage';

export interface TmdbState {
  tmdb_id: string;
  poster_path: string | null;
  title: string;
  media_type: string;
  release_date: string;
  vote_average: number;
}

export interface OpensubtitlesState {
  websiteLink: string;
  rating: string;
  format: string;
  languageName: string;
}

export interface SearchState {
  inSelectionTmdb: TmdbState | null;
  tmdb: TmdbState | null;
  openSubtitle: OpensubtitlesState | null;
  preferredLanguage: string;
}

export interface SearchStore {
  state: ComputedRef<SearchState>;
  actions: {
    reset: () => void;
    selectOpenSubtitle: (payload: OpensubtitlesState) => void;
    setPreferredLanguage: (payload: Pick<SearchState, 'preferredLanguage'>) => void;
    setTmdbInSelection: (payload: TmdbState) => void;
  };
}

declare global {
  interface Window {
    plusSub_search: Ref<SearchState>;
  }
}

export const init = ({ preferredLanguage }: { preferredLanguage: string }): SearchStore => {
  window.plusSub_search = window.plusSub_search
    ? ref({ ...window.plusSub_search.value })
    : ref<SearchState>({
        inSelectionTmdb: null,
        tmdb: null,
        openSubtitle: null,
        preferredLanguage
      });

  return {
    state: computed(() => window.plusSub_search.value),
    actions: {
      reset: () => {
        window.plusSub_search.value = {
          inSelectionTmdb: null,
          tmdb: null,
          openSubtitle: null,
          preferredLanguage: window.plusSub_search.value.preferredLanguage
        };
      },
      selectOpenSubtitle: (payload: OpensubtitlesState): void => {
        window.plusSub_search.value = {
          inSelectionTmdb: null,
          tmdb: window.plusSub_search.value.inSelectionTmdb ?? null,
          openSubtitle: payload,
          preferredLanguage: window.plusSub_search.value.preferredLanguage
        };
      },
      setPreferredLanguage: ({ preferredLanguage }: Pick<SearchState, 'preferredLanguage'>): void => {
        window.plusSub_search.value = {
          inSelectionTmdb: window.plusSub_search.value.inSelectionTmdb,
          tmdb: window.plusSub_search.value.tmdb,
          openSubtitle: window.plusSub_search.value.openSubtitle,
          preferredLanguage
        };
        storageSet({ preferredLanguage });
      },
      setTmdbInSelection: (payload: TmdbState): void => {
        window.plusSub_search.value = {
          inSelectionTmdb: payload,
          tmdb: null,
          openSubtitle: null,
          preferredLanguage: window.plusSub_search.value.preferredLanguage
        };
      }
    }
  };
};
