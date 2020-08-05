import { parse } from '#/parse';
import { setOffsetTime } from '#/setOffsetTime';
import { triggerDownload } from '#/triggerDownload';
import { createContextMenu } from 'contextMenu';

declare global {
  interface Window {
    plussub: {
      parse: () => Promise<void>;
      setOffsetTime: ({ offsetTime }: { offsetTime: number }) => Promise<void>;
      triggerDownload: () => Promise<void>;
    };
  }
}

window.plussub = {
  parse,
  setOffsetTime,
  triggerDownload
};

createContextMenu();

const rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      css: ['video']
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(() => chrome.declarativeContent.onPageChanged.removeRules(undefined, () => chrome.declarativeContent.onPageChanged.addRules([rule1])));
chrome.pageAction.onClicked.addListener(() => chrome.tabs.executeScript({ file: 'dist/popup.js' }));
