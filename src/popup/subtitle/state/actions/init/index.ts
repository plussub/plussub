import { ref, UnwrapRef } from 'vue';
import { SubtitleState } from '@/subtitle/state/types';

export const init = (): void => {
  window.plusSub_subtitle = window.plusSub_subtitle
    ? ref({ ...window.plusSub_subtitle.value })
    : ref<UnwrapRef<SubtitleState>>({
        id: null,
        raw: null,
        parsed: [],
        format: null,
        withOffsetParsed: [],
        offsetTime: 0
      });
};
