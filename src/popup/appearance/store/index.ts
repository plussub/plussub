import { ContentScriptStore } from '@/contentScript/store';

interface InitPayload {
  use: {
    contentScriptStore: ContentScriptStore;
  };
}

export interface AppearanceStore {
  actions: {
    applyStyle: (payload: ApplyStylePayload) => void;
  };
}

interface ApplyStylePayload {
  color?: string;
  backgroundColor?: string;
}

export const init = ({ use }: InitPayload): AppearanceStore => {
  return {
    actions: {
      applyStyle: (payload: ApplyStylePayload) => {
        const color = payload.color ? {'--plusSub-cue-color': payload.color} : {};
        const backgroundColor = payload.backgroundColor ? {'--plusSub-cue-background-color': payload.backgroundColor} : {};

        use.contentScriptStore.actions.sendCommandAll({
          plusSubActionFromPopup: 'APPLY_STYLE',
          style: {
            ...color,
            ...backgroundColor
          }
        });
      }
    }
  };
};
