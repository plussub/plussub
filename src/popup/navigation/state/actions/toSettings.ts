import { ToSettingsPayload } from '@/navigation/state/types';

const defaultParams: ToSettingsPayload = { contentTransitionName: 'content-navigate-deeper' as const };

export const toSettings = (params: ToSettingsPayload = defaultParams): void => {
  window.plusSub_navigation.value = {
    name: 'SETTINGS',
    params
  };
};
