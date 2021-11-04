import { Observable, merge } from 'rxjs';
import { ContentScriptInputMessageEvent } from './types';
import { filter, mergeMap, tap } from 'rxjs/operators';

declare global {
  interface Window {
    plusSub_cue: Record<string, unknown>;
  }
}

interface Payload {
  inputObservable: Observable<ContentScriptInputMessageEvent<string>>;
}

interface ApplyStylePayload {
  css: Record<string, string>;
  cue: Record<string, string>;
}

type ApplyStyleMessageEvent = ContentScriptInputMessageEvent<'APPLY_STYLE'> & { data: ApplyStylePayload };

export const init = ({ inputObservable }: Payload): Observable<[cssProperty: string, value: string]> => {
  const cssStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.plusSubContentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.css)),
    tap(([property, value]) => document.documentElement.style.setProperty(property, value))
  );


  const cueStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.plusSubContentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.cue)),
    tap(([property, value]) => {
      window.plusSub_cue[property] = value;

      const video = document.querySelector<HTMLVideoElement>('video[data-plus-sub-status="injected"]');
      if(video) {
        [...video.textTracks]
          .filter((track) => track.label === '+Sub')
          .map((track) => (track.cues ? [...track.cues] : []))
          .forEach((cues) => cues.forEach((c) => (c[property] = value)));
      }
    })
  );


  return merge(cssStyle, cueStyle);
};
