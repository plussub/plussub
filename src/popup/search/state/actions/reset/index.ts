export const reset = (): void => {
  window.plusSub_subtitleSearch.value = {
    inSelectionTmdb: null,
    tmdb: null,
    openSubtitle: null,
    preferredLanguage: window.plusSub_subtitleSearch.value.preferredLanguage
  };
};
