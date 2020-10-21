import { ref, UnwrapRef } from 'vue';
import { AppState } from '@/app/state/types';

export const init = (): void => {
  window.plusSub_app = window.plusSub_app
    ? ref({ ...window.plusSub_app.value })
    : ref<UnwrapRef<AppState>>({
        src: 'NONE',
        state: 'NONE'
      });
};
