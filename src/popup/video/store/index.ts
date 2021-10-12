import { computed, ComputedRef, onUnmounted, ref } from 'vue';
import { SubtitleEntry } from '@/subtitle/store';
import { ContentScriptStore } from '@/contentScript/store';
import { AppearanceStore } from '@/appearance/store';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { merge, Subject, interval } from 'rxjs';

interface InitPayload {
  use: {
    contentScriptStore: ContentScriptStore;
    appearanceStore: AppearanceStore;
  };
}

export interface Video {
  id: string;
  hasSubtitle: boolean;
  origin: string;
  lastTimestamp: string;
  status: "none" | "selected" | "injected"
}

export interface VideoStore {
  actions: {
    setCurrent: (payload: { video: Pick<Video, 'id'> }) => Promise<unknown>;
    removeCurrent: () => Promise<unknown>;
    addVtt: (payload: { subtitles: SubtitleEntry[]; subtitleId: string; language: string }) => void;
    setTime: (payload: { time: number }) => void;
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
  const videos = ref<Record<string, Video>>({});
  const videoUpdateIntervalObservable = interval(300).pipe(
    mergeMap(() =>
      use.contentScriptStore.actions.sendCommandWithResponse(
        { plusSubContentScriptInput: 'FIND_VIDEOS_REQUEST' },
        (responses) => responses.reduce((acc, cur) => ({ ...acc, ...cur.data.videos }), {})
      )
    ),
    tap(videoValues => {
      videos.value = videoValues
    }),
  );

  const unmountSubject = new Subject<undefined>();
  merge(videoUpdateIntervalObservable, unmountSubject).pipe(takeUntil(unmountSubject)).subscribe();
  onUnmounted(() => unmountSubject.next(undefined));

  const tick = async () => new Promise(resolve => setTimeout(() => resolve(undefined)));

  return {
    actions: {
      setCurrent: async ({ video: { id } }: { video: Pick<Video, 'id'> }) => {
        use.contentScriptStore.actions.sendCommand({ plusSubContentScriptInput: 'SELECT_VIDEO', id });
        return tick();
      },
      removeCurrent: async () => {
        use.contentScriptStore.actions.sendCommand({ plusSubContentScriptInput: 'DESELECT_VIDEO' });
        return tick();
      },
      addVtt: async ({ subtitles, subtitleId, language }: { subtitles: SubtitleEntry[]; subtitleId: string; language: string }): Promise<unknown> => {
        const video = Object.values(videos.value).find((v) => v.status === 'selected' || v.status === 'injected');
        if (!video) {
          return tick();
        }
        await use.appearanceStore.actions.applyStyle(null);

        use.contentScriptStore.actions.sendCommand({
          plusSubContentScriptInput: 'ADD_SUBTITLE',
          video: {
            id: video.id
          },
          subtitle: {
            id: subtitleId,
            entries: JSON.parse(JSON.stringify(subtitles)),
            language
          }
        });
        return tick();
      },
      setTime: ({ time }: { time: number }): void => {
        const video = Object.values(videos.value).find((v) => v.status === 'selected' || v.status === 'injected');
        if (!video) {
          console.warn('setTime: current video not found');
          return;
        }
        use.contentScriptStore.actions.sendCommand({
          plusSubContentScriptInput: 'SET_TIME',
          id: video.id,
          time
        });
      },
      highlight: ({ video }: { video: Pick<Video, 'id'> | null }): void => {
        if (!video) {
          console.warn('highlight: video not found');
          return;
        }
        use.contentScriptStore.actions.sendCommand({
          plusSubContentScriptInput: 'HIGHLIGHT_VIDEO',
          id: video.id
        });
      },
      removeHighlight: () => use.contentScriptStore.actions.sendCommand({ plusSubContentScriptInput: 'REMOVE_HIGHLIGHT_FROM_VIDEO' })
    },
    getters: {
      current: computed(() => Object.values(videos.value).find((v) => v.status === 'selected' || v.status === 'injected') ?? null),
      list: computed(() => Object.values(videos.value).sort((a, b) => a.id.localeCompare(b.id))),
      count: computed(() => Object.keys(videos.value).length)
    }
  };
};
