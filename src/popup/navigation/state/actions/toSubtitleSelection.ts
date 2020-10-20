import { ToSubtitleSelectionPayload } from '@/navigation/state/types';

export const toSubtitleSelection = (params: ToSubtitleSelectionPayload): void => {
  window.plusSub_navigation.value = {
    name: 'SUBTITLE-SELECTION',
    params
  };
};
