// use browser action because page action doesn't seem to work on incognito mode
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: 'popup.js', allFrames: true });
});
