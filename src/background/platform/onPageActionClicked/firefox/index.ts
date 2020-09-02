chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: './popup.js' }));
