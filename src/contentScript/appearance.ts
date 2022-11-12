import { Observable, merge } from 'rxjs';
import {
  ContentScriptInputMessageEvent,
  EXTENSION_LABEL,
  EXTENSION_ORIGIN,
  GenericContentScriptInputMessageEvent
} from './types';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

declare global {
  interface Window {
    cue: Record<string, unknown>;
  }
}

interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
}

type Css = 'color' | 'backgroundColor' | 'fontSize';
type Cue = 'line' | 'snapToLines';

type ApplyStylePayload = {
  css: Record<Css, string>;
  cue: Record<Cue, string>;
}

type ApplyStyleMessageEvent = ContentScriptInputMessageEvent<'APPLY_STYLE', ApplyStylePayload>;

const cssPayloadToCssVarName = (property: string) => `--${EXTENSION_ORIGIN}-cue-${property.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-')}`

export const init = ({ inputObservable }: Payload): Observable<unknown> => {
  const cssStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.contentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.css)),
    map(([property, value]) => [cssPayloadToCssVarName(property), value]),
    tap(([property, value]) => document.documentElement.style.setProperty(property, value))
  );


  const cueStyle = inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.contentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.cue)),
    tap(([property, value]) => {
      if(value === undefined){
        delete window.cue[property];
      } else {
        window.cue[property] = value;
      }

      const video = document.querySelector<HTMLVideoElement>(`video[data-${EXTENSION_ORIGIN}-status="injected"]`);
      if(video) {
        [...video.textTracks]
          .filter((track) => track.label === EXTENSION_LABEL)
          .map((track) => (track.cues ? [...track.cues] : []))
          .forEach((cues) => cues.forEach((c) => {
            if(value === undefined){
              delete c[property];
            } else {
              c[property] = value
            }
          }));
      }
    })
  );


  return merge(cssStyle, cueStyle);
};
