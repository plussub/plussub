import {AppState, setAppState} from '@/../shared/appState';

interface Payload {
  appState: AppState
}

export const remove = ({appState}: Payload): AppState => {
  return setAppState({
    ...appState,
    state: 'NONE',
    src: 'NONE',
    srt: {
      raw: null,
      parsed: [],
      withOffsetParsed: []
    },
    search: null,
    filePick: null
  });
};
