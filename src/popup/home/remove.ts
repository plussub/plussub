import {setAppState, snapshot} from '@/../shared/appState';

export const remove = (): void => {
  const snapshotResult = snapshot();
  setAppState({
    ...snapshotResult,
    state: 'NONE',
    src: 'NONE',
    srt: {
      raw: null,
      parsed: []
    },
    search: null,
    filePick: null,
    offsetTime: {
      applied: false,
      time: snapshotResult.offsetTime.time
    }
  });
};
