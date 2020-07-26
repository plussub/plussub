import { AppState, OpensubtitlesState, setAppState, snapshot, TmdbState } from '@/../shared/appState';

export const setSelection = (item: OpensubtitlesState) => {
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
