import { computed, ComputedRef, Ref, ref } from 'vue';
import { get as storageGet, set as storageSet } from 'storage';
import languageList from '@/res/iso639List.json';

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

export interface ISO639 {
  iso639_2: string;
  iso639Name: string;
}

export interface SearchStore {
  state: ComputedRef<SearchState>;
  actions: {
    reset: () => void;
    selectOpenSubtitle: (payload: OpensubtitlesState) => void;
    setPreferredLanguage: (payload: Pick<SearchState, 'preferredLanguage'>) => void;
    setTmdbInSelection: (payload: TmdbState) => void;
  };
  getters: {
    getPreferredLanguageAsIso639: ComputedRef<ISO639>;
    initialized: ComputedRef<boolean>;
  };
}

declare global {
  interface Window {
    extension_search: Ref<SearchState>;
  }
}

export const init = (): SearchStore => {
  window.extension_search = window.extension_search
    ? ref({ ...window.extension_search.value })
    : ref<SearchState>({
        inSelectionTmdb: null,
        tmdb: null,
        openSubtitle: null,
        preferredLanguage: 'en'
      });
  const initialized = ref(false);

  storageGet(['preferredLanguage']).then(async ({preferredLanguage}) => {
    if(preferredLanguage){
      window.extension_search.value.preferredLanguage = preferredLanguage;
    }
    initialized.value = true;
  });


  return {
    state: computed(() => window.extension_search.value),
    actions: {
      reset: () => {
        window.extension_search.value = {
          inSelectionTmdb: null,
          tmdb: null,
          openSubtitle: null,
          preferredLanguage: window.extension_search.value.preferredLanguage
        };
      },
      selectOpenSubtitle: (payload: OpensubtitlesState): void => {
        window.extension_search.value = {
          inSelectionTmdb: null,
          tmdb: window.extension_search.value.inSelectionTmdb ?? null,
          openSubtitle: payload,
          preferredLanguage: window.extension_search.value.preferredLanguage
        };
      },
      setPreferredLanguage: ({ preferredLanguage }: Pick<SearchState, 'preferredLanguage'>): void => {
        window.extension_search.value = {
          inSelectionTmdb: window.extension_search.value.inSelectionTmdb,
          tmdb: window.extension_search.value.tmdb,
          openSubtitle: window.extension_search.value.openSubtitle,
          preferredLanguage
        };
        storageSet({ preferredLanguage });
      },
      setTmdbInSelection: (payload: TmdbState): void => {
        window.extension_search.value = {
          inSelectionTmdb: payload,
          tmdb: null,
          openSubtitle: null,
          preferredLanguage: window.extension_search.value.preferredLanguage
        };
      }
    },
    getters: {
      getPreferredLanguageAsIso639: computed(
        () =>
          languageList.find((e) => e.iso639_2 === window.extension_search.value.preferredLanguage) ?? {
            iso639_2: 'en',
            iso639Name: 'English'
          }
      ),
      initialized: computed(() => initialized.value)
    }
  };
};
