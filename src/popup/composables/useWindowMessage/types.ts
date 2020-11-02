import { SubtitleEntry } from '@/subtitle/state/types';

export const VideosInIFrame = 'VIDEOS_IN_I_FRAME' as const;
export const Close = 'CLOSE' as const;
export const StartTranscript = 'START_TRANSCRIPT' as const;
export const StopTranscript = 'STOP_TRANSCRIPT' as const;
export const VideoCurrentTime = 'VIDEO_CURRENT_TIME' as const;
export const SetVideoTime = 'SET_VIDEO_TIME' as const;
export const AddSubtitle = 'ADD_SUBTITLE' as const;
export const RemoveSubtitle = 'REMOVE_SUBTITLE' as const;
export const GetBoundingClientRect = 'GET_BOUNDING_CLIENT_RECT' as const;
export const VideoBoundingClientRect = 'VIDEO_BOUNDING_CLIENT_RECT' as const;
export const RemoveVideoInIFrame = 'REMOVE_VIDEO_IN_I_FRAME' as const;

export type Actions =
  | typeof VideosInIFrame
  | typeof Close
  | typeof StartTranscript
  | typeof AddSubtitle
  | typeof RemoveSubtitle
  | typeof VideoCurrentTime
  | typeof StopTranscript
  | typeof GetBoundingClientRect
  | typeof VideoBoundingClientRect
  | typeof SetVideoTime
  | typeof RemoveVideoInIFrame;

type GenericEvent<T extends Actions> = {
  plusSubAction: T;
};

type GenericEventWithSrc<T extends Actions> = GenericEvent<T> & {
  src: string;
};

export type VideosInIFrameEvent = GenericEvent<typeof VideosInIFrame> & {
  frameSrc: string;
  videos: {
    currentSrc: string;
    hasSubtitle: boolean;
  }[];
};

export type RemoveVideoInIFrameEvent = GenericEvent<typeof RemoveVideoInIFrame> & {
  currentSrc: string;
  frameSrc: string;
};

export type CloseEvent = GenericEvent<typeof Close>;

export type AddSubtitleEvent = GenericEventWithSrc<typeof AddSubtitle> & {
  subtitle: SubtitleEntry[];
};
export type RemoveSubtitleEvent = GenericEventWithSrc<typeof RemoveSubtitle>;

export type GetBoundingClientRectEvent = GenericEventWithSrc<typeof GetBoundingClientRect>;

export type VideoBoundingClientRectEvent = GenericEvent<typeof VideoBoundingClientRect> & {
  boundingClientRect: DOMRect;
};

export type StartTranscriptEvent = GenericEventWithSrc<typeof StartTranscript>;
export type StopTranscriptEvent = GenericEventWithSrc<typeof StopTranscript>;
export type VideoCurrentTimeEvent = GenericEvent<typeof VideoCurrentTime> & {
  currentTime: number;
};

export type SetVideoTimeEvent = GenericEventWithSrc<typeof SetVideoTime> & {
  time: number;
};

export type GenericWindowMessagePayload<A extends Actions, E extends GenericEvent<A>> = {
  [x in A]?: (payload: MessageEvent<E>) => void;
};

export type AllUseWindowMessagePayload = GenericWindowMessagePayload<typeof VideosInIFrame, VideosInIFrameEvent> &
  GenericWindowMessagePayload<typeof RemoveVideoInIFrame, RemoveVideoInIFrameEvent> &
  GenericWindowMessagePayload<typeof Close, CloseEvent> &
  GenericWindowMessagePayload<typeof StartTranscript, StartTranscriptEvent> &
  GenericWindowMessagePayload<typeof StopTranscript, StopTranscriptEvent> &
  GenericWindowMessagePayload<typeof AddSubtitle, AddSubtitleEvent> &
  GenericWindowMessagePayload<typeof RemoveSubtitle, RemoveSubtitleEvent> &
  GenericWindowMessagePayload<typeof GetBoundingClientRect, GetBoundingClientRectEvent> &
  GenericWindowMessagePayload<typeof VideoBoundingClientRect, VideoBoundingClientRectEvent> &
  GenericWindowMessagePayload<typeof VideoCurrentTime, VideoCurrentTimeEvent> &
  GenericWindowMessagePayload<typeof SetVideoTime, SetVideoTimeEvent>;

export type UseWindowMessagePayload = Partial<AllUseWindowMessagePayload>;
export type AllEvents =
  | VideosInIFrameEvent
  | RemoveVideoInIFrameEvent
  | CloseEvent
  | StartTranscriptEvent
  | StopTranscriptEvent
  | RemoveSubtitleEvent
  | GetBoundingClientRectEvent
  | VideoBoundingClientRectEvent
  | AddSubtitleEvent
  | VideoCurrentTimeEvent
  | SetVideoTimeEvent;
