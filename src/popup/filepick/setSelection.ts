import {AppState, FilePick, setAppStatePartial, SrtState} from '@/../shared/appState';

interface Payload {
  filename: FilePick['filename'];
  rawSrt: SrtState['raw'];
}
export const setSelection = async ({ rawSrt, filename }: Payload): Promise<AppState> => {
  return setAppStatePartial({
    state: 'SELECTED',
    src: 'FILE',
    srt: {
      raw: rawSrt,
      parsed: [],
      withOffsetParsed: []
    },
    filePick: {
      filename
    }
  });
};
