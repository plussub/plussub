import {computed, ComputedRef, ref} from "vue";
import {Ref} from "@vue/reactivity";
import {parse as srtVttParse} from "@plussub/srt-vtt-parser";
import {parse as assSsaParse } from './ass-ssa-parser';
import { Store } from 'storeTypes';

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}

export type SubtitleFormat = '.srt' | '.vtt' | '.ass' | '.ssa';

export interface SubtitleState {
  id: string | null;
  raw: string | null;
  language: string | null;
  parsed: SubtitleEntry[];
  withOffsetParsed: SubtitleEntry[];
  offsetTime: number;
  format: SubtitleFormat | null;
}


export type SetRawPayload = Pick<SubtitleState, 'raw' | 'id' | 'language'> & {format: NonNullable<SubtitleState['format']>};

export interface SubtitleStore {
  state: ComputedRef<SubtitleState>;
  actions: {
    reset: () => void;
    setRaw: (payload: SetRawPayload) => void;
    setOffsetTime: (payload: Pick<SubtitleState, 'offsetTime'>) => void;
    parse: () => void;
  };
}


declare global {
  interface Window {
    extension_subtitle: Ref<SubtitleState>;
  }
}

interface InitPayload {
  use: {
    appStore: Store<'appStore'>
  }
}

export const init = ({use}: InitPayload): SubtitleStore => {
  window.extension_subtitle = window.extension_subtitle
    ? ref({ ...window.extension_subtitle.value })
    : ref<SubtitleState>({
      id: null,
      raw: null,
      language: null,
      parsed: [],
      format: null,
      withOffsetParsed: [],
      offsetTime: 0
    });

  return {
    state: computed(() => window.extension_subtitle.value),
    actions: {
      reset: (): void => {
        window.extension_subtitle.value = {
          id: null,
          raw: null,
          format: null,
          language: null,
          parsed: [],
          withOffsetParsed: [],
          offsetTime: 0
        };
      },
      setRaw: ({ raw, format, id, language }: SetRawPayload) : void => {
        window.extension_subtitle.value = {
          id,
          raw,
          format,
          language,
          parsed: [],
          withOffsetParsed: [],
          offsetTime: 0,
        }
      },
      setOffsetTime: ({ offsetTime }: Pick<SubtitleState, 'offsetTime'>): void => {
        window.extension_subtitle.value = {
          id: window.extension_subtitle.value.id,
          raw: window.extension_subtitle.value.raw,
          language: window.extension_subtitle.value.language,
          parsed: window.extension_subtitle.value.parsed,
          format:  window.extension_subtitle.value.format,
          offsetTime,
          withOffsetParsed: window.extension_subtitle.value.parsed.map((e) => ({
            ...e,
            from: e.from + offsetTime,
            to: e.to + offsetTime
          })),
        };
      },
      parse: (): void => {
        use.appStore.actions.setState({ state: 'PARSING' });
        const {raw, format, id} = window.extension_subtitle.value;
        if (!raw || !format || !id) {
          use.appStore.actions.setState({ state: 'ERROR' });
          throw new Error('raw format or id does not exists');
        }
        try {
          const parsed = (format === '.srt' || format === '.vtt') ? srtVttParse(raw).entries : assSsaParse(raw);
          window.extension_subtitle.value = {
            id,
            raw,
            parsed,
            format,
            language: window.extension_subtitle.value.language,
            offsetTime: window.extension_subtitle.value.offsetTime,
            withOffsetParsed: parsed.map((e: SubtitleEntry) => ({
              ...e,
              from: e.from + window.extension_subtitle.value.offsetTime,
              to: e.to + window.extension_subtitle.value.offsetTime
            }))
          };
          use.appStore.actions.setState({ state: 'DONE' });
        } catch(e) {
          use.appStore.actions.setState({ state: 'ERROR' });
          throw new Error('parse error');
        }
      }
    }
  }
};
