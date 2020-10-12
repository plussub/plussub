import {Ref} from "@vue/reactivity";

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}

export type SubtitleState = Ref<{
  raw: string | null;
  parsed: SubtitleEntry[];
  withOffsetParsed: SubtitleEntry[];
  offsetTime: number;
}>;

