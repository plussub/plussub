// use browser action because page action doesn't seem to work on incognito mode
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// use browser action because page action doesn't seem to work on incognito mode
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
chrome.action.onClicked.addListener(async (tab) => {
  console.warn(tab);
  if (!tab.id) {
    console.warn('missing tab id');
    return;
  }
  try {
    await chrome.scripting.insertCSS({ files: ['./font.css'], target: { allFrames: false, tabId: tab.id } });
    console.warn('insert done');
  } catch (e) {
    console.warn('insert css failed', e);
  }
  try {
    // chrome.tabs.executeScript({ file: './contentScript.js', allFrames: true });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await chrome.scripting.executeScript({
      files: ['./popup.js'],
      target: {
        allFrames: false,
        tabId: tab.id
      }
    });
  } catch (e) {
    console.warn('insert script failed', e);
  }
});
