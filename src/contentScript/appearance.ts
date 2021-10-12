import { Observable } from 'rxjs';
import { ContentScriptInputMessageEvent } from './types';
import { filter, mergeMap, tap } from 'rxjs/operators';

interface Payload {
  inputObservable: Observable<ContentScriptInputMessageEvent<string>>;
}

interface ApplyStylePayload {
  style: Record<string, string>
}

type ApplyStyleMessageEvent = ContentScriptInputMessageEvent<'APPLY_STYLE'> & { data: ApplyStylePayload };

export const init = ({ inputObservable }: Payload): Observable<[cssProperty: string, value: string]> => {
  return inputObservable.pipe(
    filter((e): e is ApplyStyleMessageEvent => e.data.plusSubContentScriptInput === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.style)),
    tap(([cssProperty, value]) => document.documentElement.style.setProperty(cssProperty, value))
  );
};
