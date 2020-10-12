import { SubtitleState } from '@/subtitle/state/types';
import { UnwrapRef } from 'vue';

export const setOffsetTime = ({ offsetTime }: Pick<UnwrapRef<SubtitleState>, 'offsetTime'>): void => {
  window.plusSub_subtitle.value = {
    raw: window.plusSub_subtitle.value.raw,
    parsed: window.plusSub_subtitle.value.parsed,
    offsetTime,
    withOffsetParsed: window.plusSub_subtitle.value.parsed.map((e) => ({
      ...e,
      from: e.from + offsetTime,
      to: e.to + offsetTime
    })),
  };
};
