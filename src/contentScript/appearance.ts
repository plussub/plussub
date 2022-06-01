import { Observable, merge } from 'rxjs';
import {
  ContentScriptInputMessageEvent,
  EXTENSION_LABEL,
  EXTENSION_ORIGIN,
  GenericContentScriptInputMessageEvent
} from './types';
import { filter, mergeMap, tap } from 'rxjs/operators';

declare global {
  interface Window {
    cue: Record<string, unknown>;
  }
}

interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
}

type ApplyStylePayload = {
  css: Record<string, string>;
  cue: Record<string, string>;
}

type ApplyStyleMessageEvent = ContentScriptInputMessageEvent<'APPLY_STYLE', ApplyStylePayload>;

export const init = ({ inputObservable }: Payload): Observable<[cssProperty: string, value: string]> => {
  const cssStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.contentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.css)),
    tap(([property, value]) => document.documentElement.style.setProperty(property, value))
  );


  const cueStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.contentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.cue)),
    tap(([property, value]) => {
      window.cue[property] = value;

      const video = document.querySelector<HTMLVideoElement>(`video[data-${EXTENSION_ORIGIN}-status="injected"]`);
      if(video) {
        [...video.textTracks]
          .filter((track) => track.label === EXTENSION_LABEL)
          .map((track) => (track.cues ? [...track.cues] : []))
          .forEach((cues) => cues.forEach((c) => (c[property] = value)));
      }
    })
  );


  return merge(cssStyle, cueStyle);
};
