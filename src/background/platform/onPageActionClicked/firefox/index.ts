// chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: './popup.js' }));
chrome.pageAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: './popup.js', allFrames: true });
});
