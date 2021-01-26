import { ToSubtitleSelectionPayload } from '@/navigation/state/types';

export const toSubtitleSelectionForMovies = (params: ToSubtitleSelectionPayload): void => {
  window.plusSub_navigation.value = {
    name: 'SUBTITLE-SELECTION-FOR-MOVIES',
    params
  };
};
