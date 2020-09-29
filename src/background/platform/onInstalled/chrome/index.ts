const rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      css: ['video']
    }),
    new chrome.declarativeContent.PageStateMatcher({
      css: ['iframe']
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(() => chrome.declarativeContent.onPageChanged.removeRules(undefined, () => chrome.declarativeContent.onPageChanged.addRules([rule1])));
