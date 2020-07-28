import {TmdbState, setAppState, AppState} from '@/../shared/appState';

interface Payload {
  item: TmdbState,
  appState: AppState
}

export const setSelection = ({item, appState}: Payload): AppState => {
  return setAppState({
    ...appState,
    search: {
      ...(appState.search ?? { opensubtitles: null, tmdb: null }),
      inSelectionTmdb: item
    }
  });
};
