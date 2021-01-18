import {SubtitleState} from "@/subtitle/state/types";
import {UnwrapRef} from "vue";

interface Payload {
  raw: UnwrapRef<SubtitleState>['raw'],
  format: NonNullable<UnwrapRef<SubtitleState>['format']>
  id: UnwrapRef<SubtitleState>['id']
}

export const setRaw = ({ raw, format, id }: Payload): void => {
  window.plusSub_subtitle.value = {
    id,
    raw,
    format,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0,
  }
}
