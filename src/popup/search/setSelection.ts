import { snapshot, TmdbState, setAppState } from '@/../shared/appState';

export const setSelection = (item: TmdbState): void => {
  const snapshotResult = snapshot();
  setAppState({
    ...snapshotResult,
    search: {
      ...(snapshotResult.search ?? { opensubtitles: null, tmdb: null }),
      inSelectionTmdb: item
    }
  });
};
