import { ref, UnwrapRef } from 'vue';
import {CurrentSelectedSrcState, NavigationState} from '@/navigation/state/types';

export const init = (): void => {
  window.plusSub_navigation =
    window.plusSub_navigation ||
    ref<UnwrapRef<NavigationState>>({
      name: 'HOME',
      params: {}
    });

  window.plusSub_currentSelectedSrc =
    window.plusSub_currentSelectedSrc ||
    ref<UnwrapRef<CurrentSelectedSrcState>>(null);
};
