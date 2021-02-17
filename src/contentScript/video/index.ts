import { filter, map, mergeMap, share, tap } from 'rxjs/operators';
import { from, fromEvent, merge, Observable } from 'rxjs';
import { create as createVideoElementMutationObservable } from './videoElementMutationObservable';
import { postMessage } from '../postMessage';
import { MessageEventFromPopup } from '../types';
import { nanoid } from 'nanoid';

interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
}

export const init = ({ messageObservable }: Payload): Observable<Record<string, { id: string; hasSubtitle: boolean; origin: string }>> => {
  const currentQuerySelectorObservable = from([...document.querySelectorAll('video')]);
  const videoElementMutationObservable = createVideoElementMutationObservable().pipe(share());
  const addedWithMutationObservable = videoElementMutationObservable.pipe(
    filter(({ added }) => added.length > 0),
    mergeMap(({ added }) => from(added))
  );

  const loadedmetadataObservable = merge(currentQuerySelectorObservable, addedWithMutationObservable).pipe(
    mergeMap((el) => fromEvent(el, 'loadedmetadata')),
    map((event) => event.target as HTMLVideoElement)
  );

  const addedVideoObservable = merge(currentQuerySelectorObservable, addedWithMutationObservable, loadedmetadataObservable).pipe(
    tap((el) => {
      el.dataset.plusSubId = !el.dataset.plusSubId || !el.querySelector('texttrack') ? nanoid(12) : el.dataset.plusSubId;
    })
  );
  const findVideosFromPopupObservable = messageObservable.pipe(filter((e) => e.data.plusSubActionFromPopup === 'FIND_VIDEOS'));
  const removedVideoElementObservable = videoElementMutationObservable.pipe(filter(({ removed }) => removed.length > 0));

  return merge(addedVideoObservable, removedVideoElementObservable, findVideosFromPopupObservable).pipe(
    map(() =>
      Object.fromEntries<{ id: string; hasSubtitle: boolean; origin: string }>(
        [...document.querySelectorAll<HTMLVideoElement & { dataset: { plusSubId: string } }>('video[data-plus-sub-id]')].map((el) => [
          el.dataset.plusSubId,
          {
            id: el.dataset.plusSubId,
            hasSubtitle: el.querySelector('texttrack') !== null,
            origin: window.location.origin
          }
        ])
      )
    ),
    tap((videos) =>
      postMessage({
        plusSubActionFromContentScript: 'FIND_VIDEOS_RESULT',
        videos
      })
    )
  );
};
