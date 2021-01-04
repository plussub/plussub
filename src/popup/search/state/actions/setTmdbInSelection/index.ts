import { TmdbState } from '@/search/state/types';

export const setTmdbInSelection = (tmdb: TmdbState): void => {
  window.plusSub_subtitleSearch.value = {
    inSelectionTmdb: tmdb,
    tmdb: null,
    openSubtitle: null,
    preferredLanguage: window.plusSub_subtitleSearch.value.preferredLanguage
  };
};
