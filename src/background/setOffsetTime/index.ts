import { setAppState, snapshot } from '../../shared/appState';

export const setOffsetTime = ({ offsetTime }: { offsetTime: number }): void => {
  const appState = snapshot();
  setAppState({
    ...appState,
    offsetTime,
    srt: {
      raw: appState.srt.raw,
      parsed: appState.srt.parsed,
      withOffsetParsed: appState.srt.parsed.map((e) => ({
        ...e,
        from: e.from + offsetTime,
        to: e.to + offsetTime
      }))
    }
  });
};
