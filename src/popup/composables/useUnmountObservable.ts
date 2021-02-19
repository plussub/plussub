import {onUnmounted} from "vue";
import {Subject, Observable} from "rxjs";

export const useUnmountObservable = (): Observable<undefined> => {
  const subject = new Subject<undefined>();
  onUnmounted(() => subject.next(undefined));
  return subject.asObservable();
}
