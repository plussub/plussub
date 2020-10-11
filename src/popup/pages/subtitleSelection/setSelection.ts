import {AppState, OpensubtitlesState, setAppStatePartial, snapshot} from '@/appState';

interface Payload {
  item: OpensubtitlesState;
}

export const setSelection = async ({item}: Payload): Promise<AppState> => {
  const appState = await snapshot();
  return setAppStatePartial({
    state: 'SELECTED',
    src: 'SEARCH',
    search: {
      inSelectionTmdb: null,
      tmdb: appState.search?.inSelectionTmdb ?? null,
      opensubtitles: item
    }
  });
};
