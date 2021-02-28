import { Observable } from 'rxjs';
import { MessageEventFromPopup } from './types';
import { filter, mergeMap, tap } from 'rxjs/operators';

interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
}

interface ApplyStylePayload {
  style: Record<string, string>
}

type ApplyStyleMessageEvent = MessageEventFromPopup<'APPLY_STYLE'> & { data: ApplyStylePayload };

export const init = ({ messageObservable }: Payload): Observable<[cssProperty: string, value: string]> => {
  return messageObservable.pipe(
    filter<MessageEventFromPopup<string>, ApplyStyleMessageEvent>((e): e is ApplyStyleMessageEvent => e.data.plusSubActionFromPopup === 'APPLY_STYLE'),
    mergeMap((e) => Object.entries(e.data.style)),
    tap(([cssProperty, value]) => document.documentElement.style.setProperty(cssProperty, value))
  );
};
