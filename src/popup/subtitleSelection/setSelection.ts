import { AppState, OpensubtitlesState, setAppState, snapshot } from '@/../shared/appState';

interface Payload {
  item: OpensubtitlesState;
  appState: AppState;
}

export const setSelection = ({item, appState}: Payload): AppState => {
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
