import { get as storageGet, set as storageSet } from 'storage';
import { interval, merge, Subject } from 'rxjs';
import { debounce, map, takeUntil } from 'rxjs/operators';
import { useStore as useContentScriptStore } from '@/contentScript/store';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type Css = 'cssColor' | 'cssBackgroundColor' | 'cssFontSize' | 'cssTextShadow';
type Cue = 'cueLine' | 'cueSnapToLines';

type SetStylePayload = Record<Css & Cue, string>;
type SetEnablePayload = Record<Css & Cue, boolean>;

const tick = async () => new Promise(resolve => setTimeout(() => resolve(undefined)));

export const useStore = defineStore('appearance', () => {
    const unmountSubject = new Subject<undefined>();
    const storeStyleSubject = new Subject();
    const storeStyleObservable = storeStyleSubject.pipe(
      debounce(() => interval(200)),
      map((style) => storageSet({ style })),
      takeUntil(unmountSubject)
    )

  const storeStyleEnableSubject = new Subject();
  const storeEnableObservable = storeStyleEnableSubject.pipe(
    debounce(() => interval(200)),
    map((styleEnable) => storageSet({ styleEnable })),
    takeUntil(unmountSubject)
  )

    const allObservables =  merge(
      unmountSubject,
      storeStyleObservable,
      storeStyleSubject,
      storeEnableObservable,
      storeStyleEnableSubject
    ).pipe(takeUntil(unmountSubject));

    const style = ref({} as SetStylePayload);
    const enabled = ref({} as SetEnablePayload);
    const initialized = ref(false);

    return {
      enabled,
      style,
      initialized,
      async initialize() {
        const { style:newStyle, styleEnable:newStyleEnable } = await storageGet(['style', 'styleEnable']);

        allObservables.subscribe();
        style.value = newStyle ?? {};
        enabled.value = newStyleEnable ?? {};
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
      async setEnable(newState: SetEnablePayload){
        enabled.value = newState;
        storeStyleEnableSubject.next(newState);
        await tick();
      },
      applyStyle () {
        const toCssPayload = (style: Record<Css, string> | Record<string, never>, enabled: Record<Css, boolean> | Record<string, never>) => ({
          color: (enabled.cssColor ?? false) ? style.cssColor ?? "initial" : "initial",
          backgroundColor: (enabled.cssBackgroundColor ?? false) ? style.cssBackgroundColor ?? "initial" : "initial",
          fontSize: (enabled.cssFontSize ?? false) ? style.cssFontSize ?? "initial" : "initial",
          textShadow: (enabled.cssTextShadow ?? false) ? style.cssTextShadow ?? "initial" : "initial"
        });

        const toCuePayload = (style: Record<Cue, string> | Record<string, never>, enabled: Record<Cue, boolean> | Record<string, never>) => ({
          line: (enabled.cueLine) ? style.cueLine ?? undefined : undefined,
          snapToLines: (enabled.cueSnapToLines) ? style.cueSnapToLines ?? undefined : undefined
        });

        const contentScriptStore = useContentScriptStore();
        contentScriptStore.sendCommand({
          contentScriptInput: 'APPLY_STYLE',
          css: {
            ...toCssPayload(style.value, enabled.value)
          },
          cue: {
            ...toCuePayload(style.value, enabled.value)
          }
        });
        return tick();
      }
    };
});
