import { navigationState } from '@/navigation/state/state';
import { ToHomePayload } from '@/navigation/state/types';

const defaultParams: ToHomePayload = { contentTransitionName: 'content-navigate-shallow' as const };

export const toHome = (params: ToHomePayload = defaultParams): void => {
  navigationState.value = {
    name: 'HOME',
    params
  };
};
