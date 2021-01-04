import { ref, UnwrapRef } from 'vue';
import { ApiState } from '@/api/state/types';

export const init = ({version}: Pick<UnwrapRef<ApiState>, 'version'>): void => {
  window.plusSub_api = window.plusSub_api
    ? ref({ ...window.plusSub_api.value })
    : ref<UnwrapRef<ApiState>>({
      version
    });
};
