import { ToHomePayload } from '@/navigation/state/types';

const defaultParams: ToHomePayload = { contentTransitionName: 'content-navigate-shallow' as const };

export const toHome = (params: ToHomePayload = defaultParams): void => {
  window.plusSub_navigation.value = {
    name: 'HOME',
    params
  };
};
