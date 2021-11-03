import { filter, tap } from 'rxjs/operators';
import {  Observable } from 'rxjs';
import { postMessage } from './postMessage';
import { ContentScriptInputMessageEvent } from './types';

interface Payload {
  inputObservable: Observable<ContentScriptInputMessageEvent<string>>;
}

interface ContentScriptInputPingMessageEvent extends ContentScriptInputMessageEvent<"PING_REQUEST">{
  data: {
    plusSubContentScriptInput: "PING_REQUEST"
    requestId: string;
  }
}

export const init = ({ inputObservable }: Payload): Observable<unknown> => {
  return inputObservable.pipe(
    filter((e): e is ContentScriptInputPingMessageEvent => e.data.plusSubContentScriptInput === 'PING_REQUEST'),
    tap(({ origin, data: { requestId } }) =>
      postMessage({
        plusSubContentScriptOutput: 'PING_RESPONSE',
        origin,
        requestId
      })
    )
  );
};
