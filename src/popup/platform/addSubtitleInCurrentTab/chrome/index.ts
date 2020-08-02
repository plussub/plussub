export const addSubtitleInCurrentTab = async (): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      chrome.tabs.executeScript({ file: 'dist/addSubtitleInCurrentTab.js' }, ([result]) => resolve());
    } catch (e) {
      reject(e);
    }
  });
