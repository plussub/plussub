import { get as storageGet, set as storageSet } from 'storage';
import { computed, ComputedRef, ref } from 'vue';
import { Store } from 'storeTypes';
import { interval, Subject, tap } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { EXTENSION_ORIGIN } from '@/types';


interface InitPayload {
  use: {
    contentScriptStore: Store<'contentScriptStore'>;
  };
}

export interface AppearanceStore {
  actions: {
    setStyle: (payload: SetStylePayload) => Promise<unknown>
    applyStyle: () => Promise<unknown> ;
  };
  state: {
    style: ComputedRef<Record<'color' | 'backgroundColor', string> | Record<string, never>>;
  };
  getters: {
    initialized: ComputedRef<boolean>;
  };
}

type Css = 'cssColor' | 'cssBackgroundColor' | 'cssFontSize';
type Cue = 'cueLine' | 'cueSnapToLines';

type SetStylePayload = Record<Css & Cue, string>;


export const init = ({ use }: InitPayload): AppearanceStore => {
  const currentStyle = ref({})
  const initialized = ref(false);

  storageGet(['style']).then(async ({style}) => {
    if(style){
      currentStyle.value = style;
    }
    initialized.value = true;
  });

  const tick = async () => new Promise(resolve => setTimeout(() => resolve(undefined)));

  const subject = new Subject();
  const result = subject.pipe(
    debounce(() => interval(200)),
    tap(() => storageSet({ style: currentStyle.value }))
  );
  result.subscribe();

  return {
    actions: {
      setStyle: async (payload: SetStylePayload): Promise<unknown> => {
        currentStyle.value = { ...currentStyle.value, ...payload };
        subject.next(currentStyle.value);
        return tick();
      },
      applyStyle: async () => {
        const toCssPayload = (style: Record<Css, string> | Record<string, never>) => ({
          ...(style.cssColor ? { [`--${EXTENSION_ORIGIN}-cue-color`]: style.cssColor } : {}),
          ...(style.cssBackgroundColor ? { [`--${EXTENSION_ORIGIN}-cue-background-color`] : style.cssBackgroundColor } : {}),
          ...(style.cssFontSize ? { [`--${EXTENSION_ORIGIN}-cue-font-size`] : style.cssFontSize } : {})
        });

        const toCuePayload = (style: Record<Cue, string> | Record<string, never>) => ({
          ...(style.cueLine ? { line: style.cueLine } : {}),
          ...(style.cueSnapToLines !== undefined ? { snapToLines: style.cueSnapToLines } : {})
        });

        use.contentScriptStore.actions.sendCommand({
          contentScriptInput: 'APPLY_STYLE',
          css: {
            ...toCssPayload(currentStyle.value)
          },
          cue: {
            ...toCuePayload(currentStyle.value)
          }
        });
        return tick();
      }
    },
    state: {
      style: computed(() => currentStyle.value)
    },
    getters: {
      initialized: computed(() => initialized.value)
    }
  };
};
