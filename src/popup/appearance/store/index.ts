import { ContentScriptStore } from '@/contentScript/store';
import { set as storageSet } from 'storage';
import { computed, ComputedRef, onUnmounted } from 'vue';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { from, merge, Subject } from 'rxjs';

interface InitPayload {
  use: {
    contentScriptStore: ContentScriptStore;
  };
  initStyle: Record<'color' | 'backgroundColor', string>;
}

export interface AppearanceStore {
  actions: {
    applyStyle: (payload: ApplyStylePayload) => void;
  };
  state: {
    style: ComputedRef<Record<'color' | 'backgroundColor', string>>;
  };
}

type ApplyStylePayload = Record<'color' | 'backgroundColor', string>;

declare global {
  interface Window {
    plussub_currentStyle: Record<string, string>;
  }
}

export const init = ({ use, initStyle }: InitPayload): AppearanceStore => {
  window.plussub_currentStyle = initStyle;

  const iFrameConnectionObservable = use.contentScriptStore.state.connectionObservable.pipe(
    mergeMap((e) => from(Object.values(e).map((e) => e.origin))),
    tap((origin) => {
      const color = window.plussub_currentStyle.color ? { '--plusSub-cue-color': window.plussub_currentStyle.color } : {};
      const backgroundColor = window.plussub_currentStyle.backgroundColor ? { '--plusSub-cue-background-color': window.plussub_currentStyle.backgroundColor } : {};

      use.contentScriptStore.actions.sendCommand(origin, {
        plusSubActionFromPopup: 'APPLY_STYLE',
        style: {
          ...color,
          ...backgroundColor
        }
      });
    })
  );

  const unmountSubject = new Subject<undefined>();
  merge(iFrameConnectionObservable).pipe(takeUntil(unmountSubject)).subscribe();
  onUnmounted(() => unmountSubject.next(undefined));

  return {
    actions: {
      applyStyle: (payload: ApplyStylePayload) => {
        window.plussub_currentStyle = {
          ...window.plussub_currentStyle,
          ...payload
        };
        storageSet({ style: payload });

        const color = window.plussub_currentStyle.color ? { '--plusSub-cue-color': window.plussub_currentStyle.color } : {};
        const backgroundColor = window.plussub_currentStyle.backgroundColor ? { '--plusSub-cue-background-color': window.plussub_currentStyle.backgroundColor } : {};

        use.contentScriptStore.actions.sendCommandAll({
          plusSubActionFromPopup: 'APPLY_STYLE',
          style: {
            ...color,
            ...backgroundColor
          }
        });
      }
    },
    state: {
      style: computed(() => window.plussub_currentStyle)
    }
  };
};
