import { setAppState, snapshot } from '../../shared/appState';

export const setOffsetTime = async({ offsetTime }: { offsetTime: number }): Promise<void> => {
  const appState = await snapshot();
  await setAppState({
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
