import { SubtitleEntry } from '../../types';
import { parse as srtVttParse } from '@plussub/srt-vtt-parser';
import { parse as assParse } from 'ass-compiler';
import { setState } from '@/app/state';

const formatAssTime = (time: number): number => Math.floor(time * 1000);
const formatAssText = (text: string): string => text.replace(/\\N/g, '\n');

export const parse = (fileName: string): void => {
  setState({ state: 'PARSING' });
  const raw = window.plusSub_subtitle.value.raw;
  if (!raw) {
    setState({ state: 'ERROR' });
    return;
  }
  let parsed;
  if (fileName.match(/\.(ass|ssa)$/)) {
    const parsedAss = assParse(raw);
    parsed = parsedAss.events.dialogue
      .filter((dialog) => dialog.Text.combined)
      .map((dialog, index) => ({ from: formatAssTime(dialog.Start), to: formatAssTime(dialog.End), text: formatAssText(dialog.Text.combined), id: index + 1 }))
      .sort((a, b) => {
        if (a.from > b.from) return 1;
        if (a.from < b.from) return -1;
        if (a.to > b.to) return 1;
        if (a.to < b.to) return -1;
        return 0;
      });
    const output: SubtitleEntry[] = [];
    // merge subtitle with same time for multi-lang subtitle
    parsed.forEach((item: SubtitleEntry) => {
      const existingIndex = output.findIndex((v) => v.from === item.from && v.to === item.to);
      if (existingIndex > -1) {
        output[existingIndex].text = output[existingIndex].text.concat('\n', item.text);
      } else {
        output.push(item);
      }
    });
    parsed = output;
  } else if (fileName.match(/\.(vtt|srt)$/)) {
    parsed = srtVttParse(raw).entries;
  } else {
    setState({ state: 'ERROR' });
    return;
  }

  window.plusSub_subtitle.value = {
    raw,
    parsed: parsed,
    offsetTime: window.plusSub_subtitle.value.offsetTime,
    withOffsetParsed: parsed.map((e: SubtitleEntry) => ({
      ...e,
      from: e.from + window.plusSub_subtitle.value.offsetTime,
      to: e.to + window.plusSub_subtitle.value.offsetTime
    }))
  };
  setState({ state: 'DONE' });
};
