const rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      css: ['video']
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(() => chrome.declarativeContent.onPageChanged.removeRules(undefined, () => chrome.declarativeContent.onPageChanged.addRules([rule1])));
