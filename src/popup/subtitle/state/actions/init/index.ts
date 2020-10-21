import { ref, UnwrapRef } from 'vue';
import { SubtitleState } from '@/subtitle/state/types';

export const init = (): void => {
  window.plusSub_subtitle = window.plusSub_subtitle
    ? ref({ ...window.plusSub_subtitle.value })
    : ref<UnwrapRef<SubtitleState>>({
        raw: null,
        parsed: [],
        withOffsetParsed: [],
        offsetTime: 0
      });
};
