import { OpensubtitlesState, setAppState, snapshot } from '@/../shared/appState';

export const setSelection = (item: OpensubtitlesState): void => {
  const snapshotResult = snapshot();

  setAppState({
    ...snapshotResult,
    state: 'SELECTED',
    src: 'SEARCH',
    search: {
      inSelectionTmdb: null,
      tmdb: snapshotResult.search?.inSelectionTmdb ?? null,
      opensubtitles: item
    }
  });
};
