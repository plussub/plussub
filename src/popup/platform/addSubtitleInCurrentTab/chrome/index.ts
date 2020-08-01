import { AddSubtitleInCurrentTabPayload } from '@/platform/addSubtitleInCurrentTab/types';

export const setInChromeStore = (targetSrc: string): Promise<void> => new Promise((resolve) => chrome.storage.local.set({ targetSrc }, () => resolve()));

export const addSubtitleInCurrentTab = async ({ targetSrc }: AddSubtitleInCurrentTabPayload): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      await setInChromeStore(targetSrc);
      chrome.tabs.executeScript({ file: 'dist/addSubtitleInCurrentTab.js' }, ([result]) => resolve());
    } catch (e) {
      reject(e);
    }
  });
