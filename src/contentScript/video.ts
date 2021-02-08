import {VideoMap} from "./VideoMap";
import {postMessage} from "./postMessage";
import {filter} from "rxjs/operators";
import {fromEvent, merge, Observable, Subscription} from "rxjs";
import {create} from "./videoElementMutationObservable";

interface Payload {
  messageObservable: Observable<MessageEvent>;
  connectionObservable: Observable<boolean>;
}

interface Result {
  videoMap: VideoMap
}

export const init = ({messageObservable, connectionObservable}: Payload): Result => {
  const videoMap = new VideoMap();
  const findVideos = () =>
    postMessage({
      plusSubActionFromContentScript: 'FIND_VIDEOS_RESULT',
      videos: videoMap.addAllAndRemoveWhichAreNotIncluded([...document.querySelectorAll('video')])
    });

  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string }>>(filter((e) => e.data.plusSubActionFromPopup === 'FIND_VIDEOS')).subscribe(() => findVideos());

  let videoElementMutationSubscription: Subscription | undefined;
  let loadedmetadataSubscription: Subscription | undefined;
  connectionObservable.subscribe((connected) => {
    if (connected) {
      loadedmetadataSubscription = merge(...[...document.querySelectorAll('video')].map((el) => fromEvent(el, 'loadedmetadata'))).subscribe(() => findVideos());
      videoElementMutationSubscription = create().subscribe(({ added }) => {
        if (added.length > 0) {
          loadedmetadataSubscription?.add(merge(...added.map((el) => fromEvent(el, 'loadedmetadata'))).subscribe(() => findVideos()));
        }
        findVideos();
      });
    } else {
      videoElementMutationSubscription?.unsubscribe();
      loadedmetadataSubscription?.unsubscribe();
    }
  });

  return {
    videoMap
  }
}
