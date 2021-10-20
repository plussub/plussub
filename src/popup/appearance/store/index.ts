import { get as storageGet, set as storageSet } from 'storage';
import { computed, ComputedRef, ref } from 'vue';
import { Store } from 'storeTypes';

interface InitPayload {
  use: {
    contentScriptStore: Store<'contentScriptStore'>;
  };
}

export interface AppearanceStore {
  actions: {
    applyStyle: (payload: ApplyStylePayload | null) => Promise<unknown> ;
  };
  state: {
    style: ComputedRef<Record<'color' | 'backgroundColor', string>>;
  };
  getters: {
    initialized: ComputedRef<boolean>;
  };
}

type ApplyStylePayload = Record<'color' | 'backgroundColor' | 'fontSize', string>;

declare global {
  interface Window {
    plussub_currentStyle: Record<string, string>;
  }
}

export const init = ({ use }: InitPayload): AppearanceStore => {
  window.plussub_currentStyle = {};
  const initialized = ref(false);

  storageGet(['style']).then(async ({style}) => {
    if(style){
      window.plussub_currentStyle = style;
    }
    initialized.value = true;
  });

  const tick = async () => new Promise(resolve => setTimeout(() => resolve(undefined)));

  return {
    actions: {
      applyStyle: async (payload: ApplyStylePayload | null): Promise<unknown> => {
        window.plussub_currentStyle = {
          ...window.plussub_currentStyle,
          ...(payload ?? {})
        };
        if(payload !== null){
          storageSet({ style: payload });
        }

        const color = window.plussub_currentStyle.color ? { '--plusSub-cue-color': window.plussub_currentStyle.color } : {};
        const backgroundColor = window.plussub_currentStyle.backgroundColor ? { '--plusSub-cue-background-color': window.plussub_currentStyle.backgroundColor } : {};
        const fontSize = window.plussub_currentStyle.fontSize ? { '--plusSub-cue-font-size': `${window.plussub_currentStyle.fontSize}px` } : {};

        use.contentScriptStore.actions.sendCommand({
          plusSubContentScriptInput: 'APPLY_STYLE',
          style: {
            ...color,
            ...backgroundColor,
            ...fontSize
          }
        });
        return tick();
      }
    },
    state: {
      style: computed(() => window.plussub_currentStyle)
    },
    getters: {
      initialized: computed(() => initialized.value)
    }
  };
};
