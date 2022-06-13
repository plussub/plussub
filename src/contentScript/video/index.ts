import { filter, map, mergeMap, share, tap } from 'rxjs/operators';
import { from, fromEvent, merge, Observable } from 'rxjs';
import { create as createVideoElementMutationObservable } from './videoElementMutationObservable';
import { postMessage } from '../postMessage';
import { EXTENSION_LABEL, EXTENSION_ORIGIN, GenericContentScriptInputMessageEvent } from '../types';
import { nanoid } from 'nanoid';

interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
}

const datasetExtensionId = `${EXTENSION_ORIGIN}Id` as const;
type HTMLVideoElementWithDataExtensionId =  HTMLVideoElement & {
  dataset: {
    [datasetExtensionId]: string
  }
}

const hasSubtitle = (el: HTMLVideoElement) => [...el.textTracks].find((track) => track.label === EXTENSION_LABEL && track.mode !== 'disabled') !== undefined;

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
      el.dataset[datasetExtensionId] = el.dataset[datasetExtensionId] && hasSubtitle(el) ? el.dataset[datasetExtensionId] : nanoid(12);
      el.dataset[`${EXTENSION_ORIGIN}Status`] = "none";
    }),
    tap((el) =>
      postMessage({
        contentScriptOutput: 'VIDEO_UPDATE',
        origin: window.location.origin,
        state: "add",
        video: {
          id: el.dataset[datasetExtensionId]
        }
      })
    )
  );
  const removedVideoElementObservable = videoElementMutationObservable.pipe(
    mergeMap(({ removed }) => from(removed)),
    tap((el) => {
      postMessage({
        contentScriptOutput: 'VIDEO_UPDATE',
        origin: window.location.origin,
        state: "removed",
        video: {
          id: el.dataset[datasetExtensionId]
        }
      })
    })
  );

  const findVideosInputObservable = inputObservable.pipe(
    filter((e) => e.data.contentScriptInput === 'FIND_VIDEOS_REQUEST'),
    map((e) => ({
      origin: window.location.origin,
      requestId: e.data.requestId,
      videos: Object.fromEntries<{ id: string; hasSubtitle: boolean; origin: string }>(
        [...document.querySelectorAll<HTMLVideoElementWithDataExtensionId>(`video[data-${EXTENSION_ORIGIN}-id]`)].map((el) => [
          el.dataset[datasetExtensionId],
          {
            id: el.dataset[datasetExtensionId],
            hasSubtitle: hasSubtitle(el),
            origin: window.location.origin,
            lastTimestamp: Math.floor(el.currentTime * 1000),
            status: el.dataset[`${EXTENSION_ORIGIN}Status`]
          }
        ])
      )
    })),
    tap(({ videos, origin, requestId}) => postMessage({
        contentScriptOutput: 'FIND_VIDEOS_RESPONSE',
        origin,
        requestId,
        videos
      })
    )
  );

  const selectVideoInputObservable = inputObservable.pipe(
    filter((e) => e.data.contentScriptInput === 'SELECT_VIDEO'),
    tap((e) =>
      [...document.querySelectorAll('video')].forEach((el) => {
        el.dataset[`${EXTENSION_ORIGIN}Status`] = el.dataset[datasetExtensionId] === e.data.id ? 'selected' : 'none';
      })
    )
  );

  const deselectVideoInputObservable = inputObservable.pipe(
    filter((e) => e.data.contentScriptInput === 'DESELECT_VIDEO'),
    tap(() => {
      [...document.querySelectorAll('video')].forEach((el) => {
        el.dataset[`${EXTENSION_ORIGIN}Status`] = 'none';
        const track = [...el.textTracks].find((track) => track.label === EXTENSION_LABEL && track.mode !== "disabled");
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
