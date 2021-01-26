import { ToSubtitleSelectionPayload } from '@/navigation/state/types';

export const toSubtitleSelectionForSeries = (params: ToSubtitleSelectionPayload): void => {
  window.plusSub_navigation.value = {
    name: 'SUBTITLE-SELECTION-FOR-SERIES',
    params
  };
};
