import { filter, tap } from 'rxjs/operators';
import {  Observable } from 'rxjs';
import { postMessage } from './postMessage';
import { ContentScriptInputMessageEvent, GenericContentScriptInputMessageEvent } from './types';

interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
}

type ContentScriptInputPingMessageEvent = ContentScriptInputMessageEvent<"PING_REQUEST", {requestId: string}>;

export const init = ({ inputObservable }: Payload): Observable<unknown> => {
  return inputObservable.pipe(
    filter((e): e is ContentScriptInputPingMessageEvent => e.data.contentScriptInput === 'PING_REQUEST'),
    tap(({ origin, data: { requestId } }) =>
      postMessage({
        contentScriptOutput: 'PING_RESPONSE',
        origin,
        requestId
      })
    )
  );
};
