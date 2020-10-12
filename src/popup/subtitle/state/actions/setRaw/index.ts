import {SubtitleState} from "@/subtitle/state/types";
import {UnwrapRef} from "vue";

export const setRaw = ({ raw }: Pick<UnwrapRef<SubtitleState>, 'raw'>): void => {
  window.plusSub_subtitle.value = {
    raw,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0
  }
}
