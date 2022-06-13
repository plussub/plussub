const injectInAllFrames = async ({ tab }: { tab: TabWithId }) => {

  const frames = await chrome.webNavigation.getAllFrames( {tabId: tab.id}) ?? [];
  const frameIds = frames.map((frame) => frame.frameId);
  const target = { tabId: tab.id, frameIds: frameIds };


  await chrome.scripting.insertCSS({ files: ['./contentScript.css'], target });
  await chrome.scripting.executeScript({ files: ['./contentScript.js'], target });
};

const injectInRootFrame = async ({ tab }: { tab: TabWithId }) => {
  const target = { allFrames: false, tabId: tab.id };
  await chrome.scripting.insertCSS({ files: ['./font.css'], target });
  await chrome.scripting.executeScript({ files: ['./popup.js'], target });
};

interface TabWithId extends chrome.tabs.Tab {
  id: number
}

const isTabWithId = (tab: chrome.tabs.Tab): tab is TabWithId => tab.id !== undefined;

// use browser action because page action doesn't seem to work on incognito mode
chrome.action.onClicked.addListener(async (tab) => {
  console.warn(tab);
  if (!isTabWithId(tab)) {
    console.warn('missing tab id');
    return;
  }
  await injectInAllFrames({ tab });
  await injectInRootFrame({ tab });
});
