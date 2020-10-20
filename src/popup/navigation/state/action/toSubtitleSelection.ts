import { navigationState } from '@/navigation/state/state';
import {ToSubtitleSelectionPayload} from "@/navigation/state/types";

export const toSubtitleSelection = (params: ToSubtitleSelectionPayload): void => {
  navigationState.value = {
    name: 'SUBTITLE-SELECTION',
    params
  };
};
