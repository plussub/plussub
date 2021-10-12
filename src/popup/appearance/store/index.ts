import { ContentScriptStore } from '@/contentScript/store';
import { set as storageSet } from 'storage';
import { computed, ComputedRef } from 'vue';

interface InitPayload {
  use: {
    contentScriptStore: ContentScriptStore;
  };
  initStyle: Record<'color' | 'backgroundColor', string>;
}

export interface AppearanceStore {
  actions: {
    applyStyle: (payload: ApplyStylePayload | null) => Promise<unknown> ;
  };
  state: {
    style: ComputedRef<Record<'color' | 'backgroundColor', string>>;
  };
}

type ApplyStylePayload = Record<'color' | 'backgroundColor' | 'fontSize', string>;

declare global {
  interface Window {
    plussub_currentStyle: Record<string, string>;
  }
}

// todo load init style here
export const init = ({ use, initStyle }: InitPayload): AppearanceStore => {
  window.plussub_currentStyle = initStyle;
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
    }
  };
};
