import { computed, ComputedRef, ref, UnwrapRef } from 'vue';
import { remove as storageRemove } from 'storage';

export interface ApiState {
  version: 'stable' | 'dev';
}

export interface ApiStore {
  state: ComputedRef<ApiState>;
  actions: {
    setVersion: (payload: Pick<ApiState, 'version'>) => void;
  };
}

export const init = (): ApiStore => {
  const state = ref<ApiState>({ version: 'dev' });
  void storageRemove(['api']);

  return {
    state: computed(() => state.value),
    actions: {
      setVersion: (): void => {
        // state.value.version = version;
        // storageSet({ api: version });
      }
    }
  };
};
