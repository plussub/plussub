import {SubtitleEntry, SubtitleState} from '../../types';
import { parse as srtVttParse } from '@plussub/srt-vtt-parser';
import { parse as assSsaParse } from './ass-ssa-parser';
import { setState } from '@/app/state';

export const parse = (): void => {
  setState({ state: 'PARSING' });
  const {raw, format, id} = window.plusSub_subtitle.value;
  if (!raw || !format || !id) {
    setState({ state: 'ERROR' });
    return;
  }
  const parsed = (format === '.srt' || format === '.vtt') ? srtVttParse(raw).entries : assSsaParse(raw);

  window.plusSub_subtitle.value = {
    id,
    raw,
    parsed,
    format,
    offsetTime: window.plusSub_subtitle.value.offsetTime,
    withOffsetParsed: parsed.map((e: SubtitleEntry) => ({
      ...e,
      from: e.from + window.plusSub_subtitle.value.offsetTime,
      to: e.to + window.plusSub_subtitle.value.offsetTime
    }))
  };
  setState({ state: 'DONE' });
};
