import {SubtitleEntry} from "@/subtitle/store";
import { parse as assParse } from 'ass-compiler';

const formatAssTime = (time: number): number => Math.floor(time * 1000);
const formatAssText = (text: string): string => text.replace(/\\N/g, '\n');

export const parse = (raw: string): SubtitleEntry[] => {
  const parsedAss = assParse(raw);
  const parsed = parsedAss.events.dialogue
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
  return output;
}
