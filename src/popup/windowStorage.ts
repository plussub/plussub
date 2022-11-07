import { EXTENSION_ORIGIN } from '@/types';

export const windowStorage = {
  getItem(key: string): string | null {
    return window[`${EXTENSION_ORIGIN}_${key}`] ?? null;
  },
  setItem(key: string, value: string) {
    window[`${EXTENSION_ORIGIN}_${key}`] = value;
  }
}