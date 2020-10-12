import { parse as srtVttParse } from '@plussub/srt-vtt-parser';
import { setState } from '@/app/state';

export const parse = (): void => {
  setState({ state: 'PARSING' });
  const raw = window.plusSub_subtitle.value.raw;
  if (!raw) {
    setState({ state: 'ERROR' });
    return;
  }
  const parsed = srtVttParse(raw);
  // get a new snapshot because maybe has something change in the meantime
  window.plusSub_subtitle.value = {
    raw,
    parsed: parsed.entries,
    offsetTime: window.plusSub_subtitle.value.offsetTime,
    withOffsetParsed: parsed.entries.map((e) => ({
      ...e,
      from: e.from + window.plusSub_subtitle.value.offsetTime,
      to: e.to + window.plusSub_subtitle.value.offsetTime
    }))
  };
};
