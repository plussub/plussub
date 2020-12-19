import {SubtitleState} from "@/subtitle/state/types";
import {UnwrapRef} from "vue";

export const setRaw = ({ raw, format, id }: Pick<UnwrapRef<SubtitleState>, 'raw' | 'format' | 'id'>): void => {
  window.plusSub_subtitle.value = {
    id,
    raw,
    format,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0,
  }
}
