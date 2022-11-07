import { parse as srtVttParse } from '@plussub/srt-vtt-parser';
import { parse as assSsaParse } from './ass-ssa-parser';
import { useStore as useAppStore } from '@/app/store';
import { defineStore } from 'pinia';
import { windowStorage } from '@/windowStorage';
import { ref } from 'vue';

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}

export type SubtitleFormat = '.srt' | '.vtt' | '.ass' | '.ssa';

export const useStore = defineStore('subtitle', () => {
  const id = ref<string | null>(null);
  const raw = ref<string | null>(null);
  const language = ref<string | null>(null);
  const parsed = ref<SubtitleEntry[]>([]);
  const format = ref<SubtitleFormat | null>(null);
  const withOffsetParsed = ref<SubtitleEntry[]>([]);
  const offsetTime = ref(0);

  return {
    id,
    raw,
    language,
    parsed,
    format,
    withOffsetParsed,
    offsetTime,
    reset() {
      id.value = null;
      raw.value = null;
      language.value = null;
      parsed.value = [];
      format.value = null;
      withOffsetParsed.value = [];
      offsetTime.value = 0;
    },
    setRaw({
             raw: newRaw,
             format: newFormat,
             id: newId,
             language: newLanguage
           }: { raw: string, format: SubtitleFormat, id: string, language: string | null }) {
      id.value = newId;
      raw.value = newRaw;
      language.value = newLanguage;
      format.value = newFormat;

      // this.$reset() and then set property results into a broken persistent state, so do it manually
      parsed.value = [];
      withOffsetParsed.value = [];
      offsetTime.value = 0;
    },
    setOffsetTime({ offsetTime: newOffsetTime }: { offsetTime: number }) {
      const validOffsetTime = Number.isNaN(newOffsetTime) ? 0 : newOffsetTime;
      offsetTime.value = validOffsetTime;
      withOffsetParsed.value = parsed.value.map((e) => ({
        ...e,
        from: e.from + validOffsetTime,
        to: e.to + validOffsetTime
      }));
    },
    parse() {
      const appStore = useAppStore();

      appStore.$patch({ state: 'PARSING' });

      if (!raw.value || !format.value || !id.value) {
        appStore.$patch({ state: 'ERROR' });
        throw new Error('raw format or id does not exists');
      }
      try {
        parsed.value = (format.value === '.srt' || format.value === '.vtt') ? srtVttParse(raw.value).entries : assSsaParse(raw.value);
        withOffsetParsed.value = parsed.value.map((e) => ({
          ...e,
          from: e.from + this.offsetTime,
          to: e.to + this.offsetTime
        }));
        appStore.$patch({ state: 'DONE' });
      } catch (e) {
        appStore.$patch({ state: 'ERROR' });
        throw new Error('parse error');
      }
    }
  };
}, {
  persist: {
    key: 'subtitle',
    storage: windowStorage
  }
});