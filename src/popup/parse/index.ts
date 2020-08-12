import { setAppState, setAppStatePartial, snapshot } from '@/../shared/appState';
import { parse as srtVttParse } from '@plussub/srt-vtt-parser';

export const parse = async (): Promise<void> => {
  await setAppStatePartial({ state: 'PARSING' });
  const {
    srt: { raw }
  } = await snapshot();
  if (!raw) {
    return;
  }
  const parsed = srtVttParse(raw);
  // get a new snapshot because maybe has something change in the meantime
  const appState = await snapshot();
  await setAppStatePartial({
    state: 'DONE',
    srt: {
      raw: appState.srt.raw,
      parsed: parsed.entries,
      withOffsetParsed: parsed.entries.map((e) => ({
        ...e,
        from: e.from + appState.offsetTime,
        to: e.to + appState.offsetTime
      }))
    }
  });
};
