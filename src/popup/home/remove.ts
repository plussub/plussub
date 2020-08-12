import {AppState, setAppStatePartial} from '@/appState';

export const remove = async (): Promise<AppState> => {
  return setAppStatePartial({
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
