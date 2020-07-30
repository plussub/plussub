import { AppState, FilePick, setAppState, SrtState } from '@/../shared/appState';

interface Payload {
  filename: FilePick['filename'];
  rawSrt: SrtState['raw'];
  appState: AppState;
}
export const setSelection = ({ rawSrt, filename, appState }: Payload): AppState => {
  return setAppState({
    ...appState,
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
