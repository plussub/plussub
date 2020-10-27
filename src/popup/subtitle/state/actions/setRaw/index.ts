import {SubtitleState} from "@/subtitle/state/types";
import {UnwrapRef} from "vue";

export const setRaw = ({ raw, format }: Pick<UnwrapRef<SubtitleState>, 'raw' | 'format'>): void => {
  window.plusSub_subtitle.value = {
    raw,
    format,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0,
  }
}
