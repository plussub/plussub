import {snapshot, TmdbState, setAppState} from "@/../shared/appState";

export const setSelection = (item: TmdbState) => {
  const snapshotResult = snapshot();
  setAppState({
    ...snapshotResult,
    search: {
      ...snapshotResult.search ?? {opensubtitles: null, tmdb: null},
      inSelectionTmdb: item
    }
  });
}
