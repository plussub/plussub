// use browser action because page action doesn't seem to work on incognito mode
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
chrome.action.onClicked.addListener(async () => {
  try {
    await chrome.tabs.insertCSS({ file: './font.css', allFrames: false, runAt: 'document_start' });
    await chrome.tabs.insertCSS({ file: './shoelace.css', allFrames: false, runAt: 'document_start' });
  } catch (e) {
    console.warn('insert css failed', e);
  }
  try {
    // chrome.tabs.executeScript({ file: './contentScript.js', allFrames: true });
    await chrome.tabs.executeScript({ file: './popup.js', allFrames: false });
  } catch (e) {
    console.warn('insert script failed', e);
  }
});
