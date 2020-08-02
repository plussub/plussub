import {AppState, OpensubtitlesState, setAppState, snapshot} from '@/../shared/appState';

interface Payload {
  item: OpensubtitlesState;
}

export const setSelection = async ({item}: Payload): Promise<AppState> => {
  const appState = await snapshot();
  return setAppState({
    ...appState,
    state: 'SELECTED',
    src: 'SEARCH',
    search: {
      inSelectionTmdb: null,
      tmdb: appState.search?.inSelectionTmdb ?? null,
      opensubtitles: item
    }
  });
};
