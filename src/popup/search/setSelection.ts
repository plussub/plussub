import {TmdbState, setAppState, AppState, snapshot} from '@/../shared/appState';

interface Payload {
  item: TmdbState
}

export const setSelection = async ({item}: Payload): Promise<AppState> => {
  const appState = await snapshot();
  return setAppState({
    ...appState,
    search: {
      ...(appState.search ?? { opensubtitles: null, tmdb: null }),
      inSelectionTmdb: item
    }
  });
};
