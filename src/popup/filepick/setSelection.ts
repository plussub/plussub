import {FilePick, setAppState, snapshot, SrtState} from '@/../shared/appState';

interface Payload {
  filename: FilePick['filename'];
  rawSrt: SrtState['raw'];
}
export const setSelection = ({rawSrt, filename}: Payload):void => {
  const snapshotResult = snapshot();
  setAppState({
    ...snapshotResult,
    state: 'SELECTED',
    src: 'FILE',
    srt: {
      raw: rawSrt,
      parsed: []
    },
    filePick: {
      filename
    },
    offsetTime: {
      applied: false,
      time: snapshotResult.offsetTime.time
    }
  });
};
