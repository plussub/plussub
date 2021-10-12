import { fromEvent, merge } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { postMessage } from './postMessage';
import { init as initPing } from './ping';
import { init as initVideo } from './video';
import { init as initHighlight } from './highlight';
import { init as initSubtitle } from './subtitle';
import { init as initTime } from './time';
import { init as initAppearance } from './appearance';
import { ContentScriptInputMessageEvent } from './types';
import { nanoid } from 'nanoid';

declare global {
  interface Window {
    contentScript: {
      id: string
    };
  }
}

(async () => {
  if (window.contentScript) {
    return;
  }
  window.contentScript = {
    id: nanoid(5)
  };

  const inputObservable = fromEvent<MessageEvent>(window.self, 'message').pipe(
    filter<MessageEvent, ContentScriptInputMessageEvent<string>>((e): e is ContentScriptInputMessageEvent<string> => typeof e.data.plusSubContentScriptInput === 'string'),
    // tap((e) => console.warn(e.data)),
    share()
  );
  const getVideoElementFrom = (id: string) => document.querySelector<HTMLVideoElement>(`video[data-plus-sub-id="${id}"]`);

  merge(
    initPing({ inputObservable }),
    initVideo({ inputObservable }),
    initHighlight({ inputObservable, getVideoElementFrom }),
    initSubtitle({ inputObservable, getVideoElementFrom }),
    initTime({ inputObservable, getVideoElementFrom }),
    initAppearance({ inputObservable })
  ).subscribe();
  postMessage({ plusSubContentScriptOutput: 'CONTENT_SCRIPT_LOADED' });
})();
