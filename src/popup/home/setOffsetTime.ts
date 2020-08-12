import {setAppStatePartial, snapshot} from '../../shared/appState';

export const setOffsetTime = async({ offsetTime }: { offsetTime: number }): Promise<void> => {
  const appState = await snapshot();
  await setAppStatePartial({
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
