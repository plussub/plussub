import {Ref} from "@vue/reactivity";

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}


export type SubtitleFormat = '.srt' | '.vtt' | '.ass' | '.ssa';

export type SubtitleState = Ref<{
  id: string | null;
  raw: string | null;
  parsed: SubtitleEntry[];
  withOffsetParsed: SubtitleEntry[];
  offsetTime: number;
  format: SubtitleFormat | null;
}>;

