import { computed, ComputedRef, ref, UnwrapRef } from 'vue';
import { set as storageSet } from 'storage';

export interface ApiState {
  version: 'stable' | 'dev';
}

export interface ApiStore {
  state: ComputedRef<ApiState>;
  actions: {
    setVersion: (payload: Pick<ApiState, 'version'>) => void;
  };
}

export const init = ({ version }: Pick<UnwrapRef<ApiState>, 'version'>): ApiStore => {
  const state = ref<ApiState>({ version });

  return {
    state: computed(() => state.value),
    actions: {
      setVersion: ({ version }: Pick<ApiState, 'version'>): void => {
        state.value.version = version;
        storageSet({ api: version });
      }
    }
  };
};
