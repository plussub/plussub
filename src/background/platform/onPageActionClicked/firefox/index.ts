// chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: './popup.js' }));
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: './popup.js', allFrames: true });
});
