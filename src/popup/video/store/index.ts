import { computed, ComputedRef, onUnmounted, Ref, ref, watch } from 'vue';
import { SubtitleEntry } from '@/subtitle/store';
import { ContentScriptStore, MessageEventFromContentScript } from '@/contentScript/store';
import { filter, first, share, shareReplay, tap } from 'rxjs/operators';
import { combineLatest, merge, Subject } from 'rxjs';
import { nanoid } from 'nanoid';

interface InitPayload {
  use: {
    contentScriptStore: ContentScriptStore;
  };
}

export interface Video {
  id: string;
  hasSubtitle: boolean;
  origin: string;
}

type CurrentSelectedVideoState = Video | null;

declare global {
  interface Window {
    plusSub_currentSelectedVideo: Ref<CurrentSelectedVideoState>;
  }
}

export interface VideoStore {
  actions: {
    setCurrent: (payload: { video: Pick<Video, 'id'> }) => void;
    removeCurrent: () => void;
    addVtt: (payload: { subtitles: SubtitleEntry[]; subtitleId: string; language: string }) => void;
    removeVtt: () => void;
    setTime: (payload: { time: number }) => void;
    useTimeUpdate: (fn: (payload: { time: number }) => void) => void;
    highlight: (payload: { video: Pick<Video, 'id'> | null }) => void;
    removeHighlight: () => void;
  };
  getters: {
    current: ComputedRef<Video | null>;
    list: ComputedRef<Video[]>;
    count: ComputedRef<number>;
  };
}

export const init = ({ use }: InitPayload): VideoStore => {
  window.plusSub_currentSelectedVideo = window.plusSub_currentSelectedVideo ? ref(window.plusSub_currentSelectedVideo.value) : ref<CurrentSelectedVideoState>(null);

  const videos = ref<Record<string, Video>>({});

  type FindVideosResultMessageEvent = MessageEventFromContentScript<'FIND_VIDEOS_RESULT'> & { data: { videos: Record<string, { id: string; hasSubtitle: boolean; origin: string }>; origin: string } };

  const findVideoResultObservable = use.contentScriptStore.state.messageObservable.pipe(
    filter<MessageEventFromContentScript<string>, FindVideosResultMessageEvent>((e): e is FindVideosResultMessageEvent => e.data.plusSubActionFromContentScript === 'FIND_VIDEOS_RESULT'),
    tap((e) => {
      videos.value = {
        ...Object.fromEntries(Object.entries(videos.value).filter(([, { origin }]) => origin !== e.data.origin)),
        ...e.data.videos
      };

      const currentSelected = window.plusSub_currentSelectedVideo.value;
      if (currentSelected && currentSelected.origin === e.data.origin) {
        const currentFromContentScript = e.data.videos[currentSelected.id];
        if (!currentFromContentScript || (currentSelected.hasSubtitle && !currentFromContentScript.hasSubtitle)) {
          console.warn('currentSelected removed');
          window.plusSub_currentSelectedVideo.value = null;
        }
      }
    })
  );

  const timeSubject = new Subject<number>();
  const timeUpdateObservable = use.contentScriptStore.state.messageObservable.pipe(
    filter((e) => e.data.plusSubActionFromContentScript === 'TIME_UPDATE'),
    tap((e) => timeSubject.next(e.data.time))
  );

  const iFrameConnectionObservable = use.contentScriptStore.state.connectionObservable.pipe(
    filter((e) => e.action === 'ADD'),
    tap((e) => use.contentScriptStore.actions.sendCommand(e.origin, { plusSubActionFromPopup: 'FIND_VIDEOS' }))
  );

  const subscription = merge(findVideoResultObservable, timeUpdateObservable, iFrameConnectionObservable).subscribe();
  onUnmounted(() => subscription.unsubscribe());

  const removeVtt = ({ id, origin }: Pick<Video, 'id' | 'origin'>) => {
    use.contentScriptStore.actions.sendCommand(origin, {
      plusSubActionFromPopup: 'REMOVE_SUBTITLE',
      video: {
        id
      }
    });
  };

  watch(
    () => window.plusSub_currentSelectedVideo.value,
    (current, prev) => {
      if (current === null && prev !== null) {
        removeVtt(prev);
      }
    }
  );

  return {
    actions: {
      setCurrent: ({ video: { id } }: { video: Pick<Video, 'id'> }) => {
        window.plusSub_currentSelectedVideo.value = videos.value[id] ?? null;
      },
      removeCurrent: () => {
        window.plusSub_currentSelectedVideo.value = null;
      },
      addVtt: ({ subtitles, subtitleId, language }: { subtitles: SubtitleEntry[]; subtitleId: string; language: string }): void => {
        const video = window.plusSub_currentSelectedVideo.value;
        if (!video) {
          return;
        }
        use.contentScriptStore.actions.sendCommand(video.origin, {
          plusSubActionFromPopup: 'ADD_SUBTITLE',
          video: {
            id: video.id
          },
          subtitle: {
            id: subtitleId,
            entries: JSON.parse(JSON.stringify(subtitles)),
            language
          }
        });
      },
      removeVtt: (): void => {
        const video = window.plusSub_currentSelectedVideo.value;
        if (!video) {
          return;
        }
        removeVtt(video);
      },
      setTime: ({ time }: { time: number }): void => {
        const video = window.plusSub_currentSelectedVideo.value;
        if (!video) {
          console.warn('setTime: current video not found');
          return;
        }
        use.contentScriptStore.actions.sendCommand(videos.value[video.id].origin, {
          plusSubActionFromPopup: 'SET_TIME',
          id: video.id,
          time
        });
      },

      useTimeUpdate: (fn: (payload: { time: number }) => void) => {
        const video = window.plusSub_currentSelectedVideo.value;
        if (!video) {
          console.warn('useTimeUpdate: current video not found');
          return;
        }
        const origin = video.origin;
        const videoId = video.id;
        const subscriptionId = nanoid(12);

        // fixme: race condition, stuff is not connected yet but component.mount did already trigger
        setTimeout(
          () =>
            use.contentScriptStore.actions.sendCommand(origin, {
              plusSubActionFromPopup: 'SUBSCRIBE_TO_TIME_UPDATE',
              video: {
                id: videoId
              },
              subscription: {
                id: subscriptionId
              }
            }),
          250
        );

        const sub = timeSubject.subscribe((time) => fn({ time }));

        onUnmounted(() => {
          sub.unsubscribe();
          use.contentScriptStore.actions.sendCommand(origin, {
            plusSubActionFromPopup: 'UNSUBSCRIBE_TO_TIME_UPDATE',
            subscription: {
              id: subscriptionId
            }
          });
        });
      },
      highlight: ({ video }: { video: Pick<Video, 'id'> | null }): void => {
        if (!video) {
          console.warn('highlight: video not found');
          return;
        }
        use.contentScriptStore.actions.sendCommand(videos.value[video.id].origin, {
          plusSubActionFromPopup: 'HIGHLIGHT_VIDEO',
          id: video.id
        });
      },
      removeHighlight: () => {
        new Set(Object.values(videos.value).map(({ origin }) => origin)).forEach((origin) => {
          use.contentScriptStore.actions.sendCommand(origin, { plusSubActionFromPopup: 'REMOVE_HIGHLIGHT_FROM_VIDEO' });
        });
      }
    },
    getters: {
      current: computed(() => window.plusSub_currentSelectedVideo.value),
      list: computed(() => Object.values(videos.value)),
      count: computed(() => Object.keys(videos.value).length)
    }
  };
};
