// chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: 'dist/popup.js', allFrames: true }));
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: 'popup.js', allFrames: true });
});
