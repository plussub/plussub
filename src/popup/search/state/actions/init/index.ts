import { ref, UnwrapRef } from 'vue';
import {SubtitleSearchState} from "@/search/state/types";

export const init = (): void => {
  window.plusSub_subtitleSearch =
    window.plusSub_subtitleSearch ||
    ref<UnwrapRef<SubtitleSearchState>>({
      inSelectionTmdb: null,
      tmdb: null,
      openSubtitle: null
    });
};
