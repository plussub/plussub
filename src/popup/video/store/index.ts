import { computed, ComputedRef, ref } from 'vue';
import { VideoSrc } from '@/currentSelectedVideoSrc/store';
import { removeUrlHash } from '@/util/url';
import { AddSubtitle, GetBoundingClientRect, postWindowMessage, RemoveSubtitle, RemoveVideoInIFrameEvent, SetVideoTime, VideoBoundingClientRect, VideosInIFrameEvent } from '@/composables';
import { SubtitleEntry } from '@/subtitle/store';

export interface Video {
  src: string;
  hasSubtitle: boolean;
  in: 'I_FRAME' | 'HOST';
  el?: HTMLVideoElement;
}

export interface IFrameSource {
  window: Window;
  frameSrc: string;
  origin: string;
}

// don't make source(of iframe) reactive as it will cause cors problem
export const srcToIFrameSource: Record<VideoSrc, IFrameSource> = {};

export interface VideoState {
  srcToHostVideo: Record<VideoSrc, Video>;
  srcToIFrameVideo: Record<VideoSrc, Video>;
}

export interface VideoStore {
  state: ComputedRef<VideoState>;
  actions: {
    findVideosInCurrentFrame: () => void;
    addIFrameVideos: (payload: MessageEvent<VideosInIFrameEvent>) => void;
    removeIFrameVideos: (payload: MessageEvent<RemoveVideoInIFrameEvent>) => { removedVideoWithSubtitle: boolean };
    addVttTo: (payload: { videoSrc: VideoSrc; subtitles: SubtitleEntry[]; subtitleId: string }) => void;
    removeVttFrom: (payload: { videoSrc: VideoSrc | null }) => void;
    setCurrentTime: (payload: { video: Video; time: number }) => void;
    highlightVideo: (payload: { videoSrc: VideoSrc|null }) => void;
    removeHighlightFromVideo: () => void;
  };
  getters: {
    srcToGlobalVideo: ComputedRef<Record<VideoSrc, Video>>;
    videoList: ComputedRef<Video[]>;
    videosWithSubtitle: ComputedRef<Video[]>;
    firstVideoWithSubtitle: ComputedRef<Video | undefined>;
    videoCount: ComputedRef<number>;
  };
}

const cues: Record<string, VTTCue[]> = {};
const isValidVideo = (el: HTMLVideoElement): boolean => el.offsetWidth !== 0 && el.offsetHeight !== 0 && el.currentSrc !== '';
export const isElementNotInViewport = (el: Element) => el.getBoundingClientRect().top >= (window.innerHeight || document.documentElement.clientHeight) || el.getBoundingClientRect().bottom <= 0;
const findVideosInCurrentFrame = (): Record<VideoSrc, Video> =>
  Object.fromEntries(
    [...document.querySelectorAll('video')]
      .filter((el) => isValidVideo(el))
      .map((el) => [
        removeUrlHash(el.currentSrc),
        {
          src: removeUrlHash(el.currentSrc),
          in: 'HOST',
          hasSubtitle: el.classList.contains('plussub'),
          el
        }
      ])
  );

export const init = (): VideoStore => {
  const state = ref<VideoState>({
    srcToHostVideo: {},
    srcToIFrameVideo: {}
  });

  const srcToGlobalVideo = computed(() => ({
    ...state.value.srcToHostVideo,
    ...state.value.srcToIFrameVideo
  }));

  const videoList = computed(() => Object.values(srcToGlobalVideo.value));
  const videosWithSubtitle = computed(() => videoList.value.filter((e) => e.hasSubtitle));

  return {
    state: computed(() => state.value),
    actions: {
      findVideosInCurrentFrame: () => {
        state.value.srcToHostVideo = findVideosInCurrentFrame();
      },
      addIFrameVideos: (payload: MessageEvent<VideosInIFrameEvent>) => {
        payload.data.videos.forEach((e) => {
          srcToIFrameSource[removeUrlHash(e.currentSrc)] = {
            window: payload.source as Window,
            frameSrc: payload.data.frameSrc,
            origin: payload.origin
          };
        });

        Object.assign(
          state.value.srcToIFrameVideo,
          Object.fromEntries(
            payload.data.videos.map((e) => [
              removeUrlHash(e.currentSrc),
              {
                hasSubtitle: e.hasSubtitle,
                src: removeUrlHash(e.currentSrc),
                in: 'I_FRAME'
              }
            ])
          )
        );
      },
      removeIFrameVideos: (payload: MessageEvent<RemoveVideoInIFrameEvent>): { removedVideoWithSubtitle: boolean } => {
        const currentSrc = removeUrlHash(payload.data.currentSrc);
        const removedVideoWithSubtitle = state.value.srcToIFrameVideo.value[currentSrc]?.hasSubtitle;
        delete state.value.srcToIFrameVideo.value[currentSrc];
        delete srcToIFrameSource[payload.data.frameSrc];
        return {
          removedVideoWithSubtitle
        };
      },
      addVttTo: ({ videoSrc, subtitles, subtitleId }: { videoSrc: VideoSrc; subtitles: SubtitleEntry[]; subtitleId: string }): void => {
        const video = srcToGlobalVideo.value[videoSrc];
        if (video.in === 'HOST') {
          if (!video.el) {
            return;
          }
          if (cues[subtitleId]) {
            cues[subtitleId].forEach((c, idx) => {
              c.startTime = subtitles[idx].from / 1000;
              c.endTime = subtitles[idx].to / 1000;
            });
            return;
          }
          cues[subtitleId] = subtitles.map((srt) => new VTTCue(srt.from / 1000, srt.to / 1000, `<c.plussub>${srt.text}</c.plussub>`));
          Array.from(video.el.textTracks).forEach((track) => (track.mode = 'hidden'));
          const track = video.el.addTextTrack('subtitles', `Plussub`, 'en');
          cues[subtitleId].forEach((cue) => track.addCue(cue));
          track.mode = 'showing';
          video.el.classList.add('plussub');
        } else {
          const iFrameSource = srcToIFrameSource[video.src];
          if (!iFrameSource) {
            return;
          }
          postWindowMessage({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            window: iFrameSource.window,
            origin: iFrameSource.origin,
            payload: {
              plusSubAction: AddSubtitle,
              src: video.src,
              // get rid of all proxies ... dont knnow a better way yet -_(*.*)_-
              subtitles: JSON.parse(JSON.stringify(subtitles)),
              subtitleId
            }
          });
        }
        video.hasSubtitle = true;
      },
      removeVttFrom: ({ videoSrc }: { videoSrc: VideoSrc | null  }): void => {
        if(!videoSrc){
          return;
        }
        const video = srcToGlobalVideo.value[videoSrc];
        if (!video) {
          return;
        }
        if (video.in === 'HOST') {
          if (!video.el) {
            return;
          }
          Object.keys(cues).forEach((k) => delete cues[k]);
          video.el.classList.remove('plussub');
          Array.from(video.el.textTracks)
            .filter((track) => track.label === 'Plussub')
            .forEach((track) => (track.mode = 'disabled'));
        } else {
          const iFrameSource = srcToIFrameSource[video.src];
          if (!iFrameSource) {
            return;
          }
          postWindowMessage({
            window: iFrameSource.window,
            origin: iFrameSource.origin,
            payload: {
              plusSubAction: RemoveSubtitle,
              src: video.src
            }
          });
        }
        video.hasSubtitle = false;
      },
      setCurrentTime: ({ video, time }: { video: Video; time: number }): void => {
        if (video.in === 'HOST') {
          if (video.el) {
            video.el.currentTime = time;
          }
        } else {
          const iFrameSource = srcToIFrameSource[video.src];
          if (!iFrameSource) {
            return;
          }
          postWindowMessage({
            window: iFrameSource.window,
            origin: iFrameSource.origin,
            payload: {
              plusSubAction: SetVideoTime,
              src: video.src,
              time
            }
          });
        }
      },
      highlightVideo: ({ videoSrc }: { videoSrc: VideoSrc | null }): void => {
        if(!videoSrc){
          return;
        }
        const video = srcToGlobalVideo.value[videoSrc];
        if (!video) {
          return;
        }
        if (video.in === 'HOST') {
          if (!video.el) {
            return;
          }

          if (isElementNotInViewport(video.el)) {
            video.el.scrollIntoView({ block: 'center' });
            const plussubShadow = document.getElementById('plussubShadow');
            if (!plussubShadow) {
              return;
            }
            plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
          }

          const overlayHighlight = document.getElementById('plussub-overlay-highlight');
          if (!overlayHighlight) {
            return;
          }

          const { top, left, height, width } = video.el.getBoundingClientRect();
          overlayHighlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${window.scrollY + top}px; left: ${
            window.scrollX + left
          }px;`;
        } else {
          const el = document.querySelector(`iframe[src="${srcToIFrameSource[video.src].frameSrc}"]`);
          if (!el) {
            return;
          }

          if (isElementNotInViewport(el)) {
            el.scrollIntoView({ block: 'center' });
            const plussubShadow = document.getElementById('plussubShadow');
            if (!plussubShadow) {
              return;
            }
            plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
          }

          const overlayHighlight = document.getElementById('plussub-overlay-highlight');
          if (!overlayHighlight) {
            return;
          }
          console.warn('before declare');

          // Not use useWindowMessage as I want to remove event listener immediately
          // todo: implement once
          const handleMessageInPageVideos = (e) => {
            const { plusSubAction, boundingClientRect } = e.data;
            if (plusSubAction === VideoBoundingClientRect) {
              window.removeEventListener('message', handleMessageInPageVideos);
              const iframeBoundingClientRect = el.getBoundingClientRect();
              const iFrameTop = iframeBoundingClientRect.top;
              const iFrameLeft = iframeBoundingClientRect.left;
              const { top, left, height, width } = boundingClientRect;
              overlayHighlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${
                window.scrollY + top + iFrameTop
              }px; left: ${window.scrollX + left + iFrameLeft}px;`;
            }
          };
          window.addEventListener('message', handleMessageInPageVideos);
          postWindowMessage({
            window: srcToIFrameSource[video.src].window,
            origin: srcToIFrameSource[video.src].origin,
            payload: {
              plusSubAction: GetBoundingClientRect,
              src: video.src
            }
          });
        }
      },
      removeHighlightFromVideo: () => {
        const overlayHightlight = document.getElementById('plussub-overlay-highlight');
        if (!overlayHightlight) {
          return;
        }
        overlayHightlight.style.cssText = `width: 0px; height: 0px;`;
      }
    },
    getters: {
      srcToGlobalVideo,
      videoList,
      videosWithSubtitle,
      firstVideoWithSubtitle: computed(() => videosWithSubtitle.value[0]),
      videoCount: computed(() => videoList.value.length)
    }
  };
};
