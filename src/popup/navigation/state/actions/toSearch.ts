import { navigationState } from '@/navigation/state/state';
import {ToSearchPayload} from "@/navigation/state/types";

const defaultParams: ToSearchPayload = { contentTransitionName: 'content-navigate-deeper' as const };

export const toSearch = (params: ToSearchPayload = defaultParams): void => {
  window.plusSub_navigation.value = {
    name: 'SEARCH',
    params
  };
};
