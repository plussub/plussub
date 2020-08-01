import { parse } from '#/parse';
import { setOffsetTime } from '#/setOffsetTime';
import { triggerDownload } from '#/triggerDownload';
import { createContextMenu } from 'contextMenu';

declare global {
  interface Window {
    plussub: {
      parse: () => void;
      setOffsetTime: ({ offsetTime }: { offsetTime: number }) => void;
      triggerDownload: () => Promise<void>;
      exec: () => void;
    };
  }
}

window.plussub = {
  parse,
  setOffsetTime,
  triggerDownload,
  exec: () => {
    chrome.tabs.executeScript(
      {
        file: 'dist/addSubtitleContentScript.js'
      },
      (result) => {
        console.warn(result);
      }
    );
  }
};

createContextMenu();
