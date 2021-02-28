import {Observable} from "rxjs";
import {MessageEventFromPopup} from "../types";
import {filter, map, tap} from "rxjs/operators";

interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
}

interface ApplyStylePayload {
  style: {
    backgroundColor?: string;
    color?: string;
  }
}
type ApplyStyleMessageEvent = MessageEventFromPopup<'APPLY_STYLE'> & { data: ApplyStylePayload };

export const init = ({ messageObservable }: Payload): Observable<ApplyStyleMessageEvent> => {
  return messageObservable.pipe(
    filter<MessageEventFromPopup<string>, ApplyStyleMessageEvent>((e): e is ApplyStyleMessageEvent => e.data.plusSubActionFromPopup === 'APPLY_STYLE'),
    tap(e => {
      Object.entries(e.data.style).forEach(([k,v])=> {
        if(v){
          document.documentElement.style.setProperty(k,  v ?? null);
        }
      });
    })
  );
};
