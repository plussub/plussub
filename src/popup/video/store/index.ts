import { computed, ComputedRef, onUnmounted, ref } from 'vue';
import { SubtitleEntry } from '@/subtitle/store';
import { Store } from 'storeTypes';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { merge, Subject, interval } from 'rxjs';

interface InitPayload {
  use: {
    contentScriptStore: Store<'contentScriptStore'>;
    appearanceStore: Store<'appearanceStore'>;
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
    videoName: ComputedRef<string>;
  };
}

export const init = ({ use }: InitPayload): VideoStore => {
  const videos = ref<Record<string, Video>>({});
  const videoUpdateIntervalObservable = interval(300).pipe(
    mergeMap(() =>
      use.contentScriptStore.actions.sendCommandWithResponse(
        { contentScriptInput: 'FIND_VIDEOS_REQUEST' },
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
        use.contentScriptStore.actions.sendCommand({ contentScriptInput: 'SELECT_VIDEO', id });
        return tick();
      },
      removeCurrent: async () => {
        use.contentScriptStore.actions.sendCommand({ contentScriptInput: 'DESELECT_VIDEO' });
        return tick();
      },
      addVtt: async ({ subtitles, subtitleId, language }: { subtitles: SubtitleEntry[]; subtitleId: string; language: string }): Promise<unknown> => {
        const video = Object.values(videos.value).find((v) => v.status === 'selected' || v.status === 'injected');
        if (!video) {
          return tick();
        }
        await use.appearanceStore.actions.applyStyle();

        use.contentScriptStore.actions.sendCommand({
          contentScriptInput: 'ADD_SUBTITLE',
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
          contentScriptInput: 'SET_TIME',
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
          contentScriptInput: 'HIGHLIGHT_VIDEO',
          id: video.id
        });
      },
      removeHighlight: () => use.contentScriptStore.actions.sendCommand({ contentScriptInput: 'REMOVE_HIGHLIGHT_FROM_VIDEO' })
    },
    getters: {
      current: computed(() => Object.values(videos.value).find((v) => v.status === 'selected' || v.status === 'injected') ?? null),
      list: computed(() => Object.values(videos.value).sort((a, b) => a.id.localeCompare(b.id))),
      count: computed(() => Object.keys(videos.value).length),
      videoName: computed(() => {
        const REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/;
        const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
        const REGEX_SPECIAL_CHAR = /^(.*?)[ (（[0-9_ ：第-]/;

        switch (window.location.hostname) {
          case 'www.youtube.com':
            return document.title.replace(' - YouTube', '');
          case 'vimeo.com':
            return document.title.replace(' on Vimeo', '');
          case 'flixtor.to':
            return document.querySelector('.watch-header.h4.mb-0.font-weight-normal.link.hidden-sm-down')?.firstChild?.textContent?.trim() ?? '1';
          default:
            if (REGEX_JAPANESE.test(document.title[0]) || REGEX_CHINESE.test(document.title[0])) {
              const nameRegexResult = REGEX_SPECIAL_CHAR.exec(document.title);
              if (nameRegexResult && nameRegexResult[1]) return nameRegexResult[1].replace(/(合集|DVD版|(国|粤)语)/, '');
            }
            return document.title;
        }
      })
    }
  };
};
