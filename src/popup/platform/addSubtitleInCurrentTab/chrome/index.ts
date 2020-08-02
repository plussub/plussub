import { snapshot } from '@/../shared/appState';

export const setInChromeStore = (): Promise<void> => new Promise((resolve) => chrome.storage.local.set(snapshot(), () => resolve()));

export const addSubtitleInCurrentTab = async (): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      await setInChromeStore();
      chrome.tabs.executeScript({ file: 'dist/addSubtitleInCurrentTab.js' }, ([result]) => resolve());
    } catch (e) {
      reject(e);
    }
  });
