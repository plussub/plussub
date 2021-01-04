import {set as storageSet} from 'storage';

export const setPreferredLanguage = (preferredLanguage: string): void => {
  window.plusSub_subtitleSearch.value = {
    inSelectionTmdb: window.plusSub_subtitleSearch.value.inSelectionTmdb,
    tmdb:  window.plusSub_subtitleSearch.value.tmdb,
    openSubtitle:  window.plusSub_subtitleSearch.value.openSubtitle,
    preferredLanguage
  };

  storageSet({preferredLanguage});
};
