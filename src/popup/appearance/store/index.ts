import { get as storageGet, set as storageSet } from 'storage';
import { interval, merge, Subject } from 'rxjs';
import { debounce, map, takeUntil } from 'rxjs/operators';
import { EXTENSION_ORIGIN } from '@/types';
import { useStore as useContentScriptStore } from '@/contentScript/store';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type Css = 'cssColor' | 'cssBackgroundColor' | 'cssFontSize';
type Cue = 'cueLine' | 'cueSnapToLines';

type SetStylePayload = Record<Css & Cue, string>;

const tick = async () => new Promise(resolve => setTimeout(() => resolve(undefined)));

export const useStore = defineStore('appearance', () => {
    const unmountSubject = new Subject<undefined>();
    const storeStyleSubject = new Subject();
    const storeStyleObservable = storeStyleSubject.pipe(
      debounce(() => interval(200)),
      map((style) => storageSet({ style })),
      takeUntil(unmountSubject)
    )

    const allObservables =  merge(
      unmountSubject,
      storeStyleObservable,
      storeStyleSubject
    ).pipe(takeUntil(unmountSubject));

    const style = ref({} as SetStylePayload);
    const initialized = ref(false);

    return {
      style,
      initialized,
      async initialize() {
        const { style:newStyle } = await storageGet(['style']);
        allObservables.subscribe();
        style.value = newStyle ?? {};
        initialized.value = true;
      },
      unmount() {
        unmountSubject.next(undefined);
      },
      async setStyle(newStyle: SetStylePayload){
        style.value = newStyle;
        storeStyleSubject.next(newStyle);
        await tick();
      },
      applyStyle () {
        const toCssPayload = (style: Record<Css, string> | Record<string, never>) => ({
          ...(style.cssColor ? { [`--${EXTENSION_ORIGIN}-cue-color`]: style.cssColor } : {}),
          ...(style.cssBackgroundColor ? { [`--${EXTENSION_ORIGIN}-cue-background-color`] : style.cssBackgroundColor } : {}),
          ...(style.cssFontSize ? { [`--${EXTENSION_ORIGIN}-cue-font-size`] : style.cssFontSize } : {})
        });

        const toCuePayload = (style: Record<Cue, string> | Record<string, never>) => ({
          ...(style.cueLine ? { line: style.cueLine } : {}),
          ...(style.cueSnapToLines !== undefined ? { snapToLines: style.cueSnapToLines } : {})
        });
        const contentScriptStore = useContentScriptStore();
        contentScriptStore.sendCommand({
          contentScriptInput: 'APPLY_STYLE',
          css: {
            ...toCssPayload(style.value)
          },
          cue: {
            ...toCuePayload(style.value)
          }
        });
        return tick();
      }
    };
});
