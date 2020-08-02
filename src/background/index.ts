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
