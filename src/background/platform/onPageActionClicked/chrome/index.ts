chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: 'dist/popup.js' }));
