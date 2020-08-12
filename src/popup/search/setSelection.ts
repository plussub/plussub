import {TmdbState, setAppState, AppState, snapshot, setAppStatePartial} from '@/../shared/appState';

interface Payload {
  item: TmdbState
}

export const setSelection = async ({item}: Payload): Promise<AppState> => {
  const appState = await snapshot();
  return setAppStatePartial({
    search: {
      ...(appState.search ?? { opensubtitles: null, tmdb: null }),
      inSelectionTmdb: item
    }
  });
};
