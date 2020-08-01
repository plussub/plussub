interface VideoEntry {
  hasSubtitle: boolean;
  src: string;
}

interface Result {
  videos: VideoEntry[];
}

export const findVideosInCurrentTab = async (): Promise<Result> =>
  new Promise((resolve, reject) => {
    try {
      chrome.tabs.executeScript({ file: 'dist/findVideosInCurrentTab.js' }, ([result]) => resolve(result));
    } catch (e) {
      reject(e);
    }
  });
