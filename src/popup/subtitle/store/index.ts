import {computed, ComputedRef, ref} from "vue";
import {Ref} from "@vue/reactivity";
import {AppStore} from "@/app/store";
import {parse as srtVttParse} from "@plussub/srt-vtt-parser";
import {parse as assSsaParse } from './ass-ssa-parser';

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}

export type SubtitleFormat = '.srt' | '.vtt' | '.ass' | '.ssa';

export interface SubtitleState {
  id: string | null;
  raw: string | null;
  parsed: SubtitleEntry[];
  withOffsetParsed: SubtitleEntry[];
  offsetTime: number;
  format: SubtitleFormat | null;
}


export type SetRawPayload = Pick<SubtitleState, 'raw' | 'id'> & {format: NonNullable<SubtitleState['format']>};

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
    plusSub_subtitle: Ref<SubtitleState>;
  }
}

interface InitPayload {
  use: {
    appStore: AppStore
  }
}

export const init = ({use}: InitPayload): SubtitleStore => {
  window.plusSub_subtitle = window.plusSub_subtitle
    ? ref({ ...window.plusSub_subtitle.value })
    : ref<SubtitleState>({
      id: null,
      raw: null,
      parsed: [],
      format: null,
      withOffsetParsed: [],
      offsetTime: 0
    });

  return {
    state: computed(() => window.plusSub_subtitle.value),
    actions: {
      reset: (): void => {
        window.plusSub_subtitle.value = {
          id: null,
          raw: null,
          format: null,
          parsed: [],
          withOffsetParsed: [],
          offsetTime: 0
        };
      },
      setRaw: ({ raw, format, id }: SetRawPayload) : void => {
        window.plusSub_subtitle.value = {
          id,
          raw,
          format,
          parsed: [],
          withOffsetParsed: [],
          offsetTime: 0,
        }
      },
      setOffsetTime: ({ offsetTime }: Pick<SubtitleState, 'offsetTime'>): void => {
        window.plusSub_subtitle.value = {
          id: window.plusSub_subtitle.value.id,
          raw: window.plusSub_subtitle.value.raw,
          parsed: window.plusSub_subtitle.value.parsed,
          format:  window.plusSub_subtitle.value.format,
          offsetTime,
          withOffsetParsed: window.plusSub_subtitle.value.parsed.map((e) => ({
            ...e,
            from: e.from + offsetTime,
            to: e.to + offsetTime
          })),
        };
      },
      parse: (): void => {
        use.appStore.actions.setState({ state: 'PARSING' });
        const {raw, format, id} = window.plusSub_subtitle.value;
        if (!raw || !format || !id) {
          use.appStore.actions.setState({ state: 'ERROR' });
          throw new Error('raw format or id does not exists');
        }
        try {
          const parsed = (format === '.srt' || format === '.vtt') ? srtVttParse(raw).entries : assSsaParse(raw);
          window.plusSub_subtitle.value = {
            id,
            raw,
            parsed,
            format,
            offsetTime: window.plusSub_subtitle.value.offsetTime,
            withOffsetParsed: parsed.map((e: SubtitleEntry) => ({
              ...e,
              from: e.from + window.plusSub_subtitle.value.offsetTime,
              to: e.to + window.plusSub_subtitle.value.offsetTime
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
