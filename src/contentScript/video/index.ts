import { filter, map, mergeMap, share, tap } from 'rxjs/operators';
import { from, fromEvent, merge, Observable } from 'rxjs';
import { create as createVideoElementMutationObservable } from './videoElementMutationObservable';
import { postMessage } from '../postMessage';
import { ContentScriptInputMessageEvent } from '../types';
import { nanoid } from 'nanoid';

interface Payload {
  inputObservable: Observable<ContentScriptInputMessageEvent<string>>;
}
const hasSubtitle = (el: HTMLVideoElement) => [...el.textTracks].find((track) => track.label === '+Sub' && track.mode !== 'disabled') !== undefined;

export const init = ({ inputObservable }: Payload): Observable<unknown> => {
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
      el.dataset.plusSubId = !el.dataset.plusSubId || !hasSubtitle(el) ? nanoid(12) : el.dataset.plusSubId;
      el.dataset.plusSubStatus = "none";
    }),
    tap((el) =>
      postMessage({
        plusSubContentScriptOutput: 'VIDEO_UPDATE',
        origin: window.location.origin,
        state: "add",
        video: {
          id:  el.dataset.plusSubId
        }
      })
    )
  );
  const removedVideoElementObservable = videoElementMutationObservable.pipe(
    mergeMap(({ removed }) => from(removed)),
    tap((el) => {
      postMessage({
        plusSubContentScriptOutput: 'VIDEO_UPDATE',
        origin: window.location.origin,
        state: "removed",
        video: {
          id:  el.dataset.plusSubId
        }
      })
    })
  );


  const findVideosInputObservable = inputObservable.pipe(
    filter((e) => e.data.plusSubContentScriptInput === 'FIND_VIDEOS_REQUEST'),
    map((e) => ({
      origin: window.location.origin,
      requestId: e.data.requestId,
      videos: Object.fromEntries<{ id: string; hasSubtitle: boolean; origin: string }>(
        [...document.querySelectorAll<HTMLVideoElement & { dataset: { plusSubId: string } }>('video[data-plus-sub-id]')].map((el) => [
          el.dataset.plusSubId,
          {
            id: el.dataset.plusSubId,
            hasSubtitle: hasSubtitle(el),
            origin: window.location.origin,
            lastTimestamp: Math.floor(el.currentTime * 1000),
            status: el.dataset.plusSubStatus
          }
        ])
      )
    })),
    tap(({ videos, origin, requestId}) => postMessage({
        plusSubContentScriptOutput: 'FIND_VIDEOS_RESPONSE',
        origin,
        requestId,
        videos
      })
    )
  );

  const selectVideoInputObservable = inputObservable.pipe(
    filter((e) => e.data.plusSubContentScriptInput === 'SELECT_VIDEO'),
    tap((e) =>
      [...document.querySelectorAll('video')].forEach((el) => {
        el.dataset.plusSubStatus = el.dataset.plusSubId === e.data.id ? 'selected' : 'none';
      })
    )
  );

  const deselectVideoInputObservable = inputObservable.pipe(
    filter((e) => e.data.plusSubContentScriptInput === 'DESELECT_VIDEO'),
    tap(() => {
      [...document.querySelectorAll('video')].forEach((el) => {
        el.dataset.plusSubStatus = 'none';
        const track = [...el.textTracks].find((track) => track.label === '+Sub' && track.mode !== "disabled");
        if(track){
          track.mode = "disabled";
        }
      });
    })
  );

  return merge(
    addedVideoObservable,
    removedVideoElementObservable,
    findVideosInputObservable,
    selectVideoInputObservable,
    deselectVideoInputObservable
  );
};
