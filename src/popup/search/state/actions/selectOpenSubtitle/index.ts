import { OpensubtitlesState } from '@/search/state/types';

export const selectOpenSubtitle = (opensubtitle: OpensubtitlesState): void => {
  window.plusSub_subtitleSearch.value = {
    inSelectionTmdb: null,
    tmdb:  window.plusSub_subtitleSearch.value.inSelectionTmdb ?? null,
    openSubtitle: opensubtitle,
    preferredLanguage: window.plusSub_subtitleSearch.value.preferredLanguage
  };
};
