import { fromEvent, merge } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { postMessage } from './postMessage';
import { init as initPing } from './ping';
import { init as initVideo } from './video';
import { init as initHighlight } from './highlight';
import { init as initSubtitle } from './subtitle';
import { init as initTime } from './time';
import { init as initAppearance } from './appearance';
import {
  GenericContentScriptInputMessageEvent,
  isGenericContentScriptInputMessageEvent,
  EXTENSION_ORIGIN
} from './types';
import { nanoid } from 'nanoid';

declare global {
  interface Window {
    contentScript: {
      id: string
    };
    cue: Record<string, unknown>;
  }
}

(async () => {
  if (window.contentScript) {
    return;
  }
  window.contentScript = {
    id: nanoid(5)
  };
  window.cue =  window.cue || {};


  const inputObservable = fromEvent<MessageEvent>(window.self, 'message').pipe(
    filter<MessageEvent, GenericContentScriptInputMessageEvent>(isGenericContentScriptInputMessageEvent),
    share()
  );
  const getVideoElementFrom = (id: string) => document.querySelector<HTMLVideoElement>(`video[data-${EXTENSION_ORIGIN}-id="${id}"]`);

  merge(
    initPing({ inputObservable }),
    initVideo({ inputObservable }),
    initHighlight({ inputObservable, getVideoElementFrom }),
    initSubtitle({ inputObservable, getVideoElementFrom }),
    initTime({ inputObservable, getVideoElementFrom }),
    initAppearance({ inputObservable })
  ).subscribe();
  postMessage({ contentScriptOutput: 'CONTENT_SCRIPT_LOADED' });
})();
