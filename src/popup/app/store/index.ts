import {computed, ComputedRef, Ref, ref} from 'vue';

export type AppState = {
  state: 'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'ERROR' | 'DONE';
  src: 'NONE' | 'FILE' | 'SEARCH';
};

export interface AppStore {
  state: ComputedRef<AppState>;
  actions: {
    setState: (payload: Pick<AppState, 'state'>) => void;
    setSrc: (payload: Pick<AppState, 'src'>) => void;
    reset: () => void;
  };
}

declare global {
  interface Window {
    extension_app: Ref<AppState>;
  }
}

export const init = (): AppStore => {
  window.extension_app = window.extension_app
    ? ref({ ...window.extension_app.value })
    : ref<AppState>({
        src: 'NONE',
        state: 'NONE'
      });

  return {
    state: computed(() => window.extension_app.value),
    actions: {
      setState: ({ state }: Pick<AppState, 'state'>) => (window.extension_app.value.state = state),
      setSrc: ({ src }: Pick<AppState, 'src'>) => (window.extension_app.value.src = src),
      reset: () => {
        window.extension_app.value.state = "NONE";
        window.extension_app.value.src = "NONE";
      }
    }
  };
};
