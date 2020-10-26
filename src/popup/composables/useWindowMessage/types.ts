import { SubtitleEntry } from '@/subtitle/state/types';

export const VideosInIFrame = 'VIDEOS_IN_I_FRAME' as const;
export const Close = 'CLOSE' as const;
export const StartTranscript = 'START_TRANSCRIPT' as const;
export const StopTranscript = 'STOP_TRANSCRIPT' as const;
export const VideoCurrentTime = 'VIDEO_CURRENT_TIME' as const;
export const SetVideoTime = 'SET_VIDEO_TIME' as const;
export const AddSubtitle = 'ADD_SUBTITLE' as const;
export const RemoveSubtitle = 'REMOVE_SUBTITLE' as const;
export const GetBoundingClientRect = 'Get_Bounding_Client_Rect' as const;
export const VideoBoundingClientRect = 'Video_Bounding_Client_Rect' as const;
export const RemoveVideoInIFrame = 'REMOVE_VIDEO_IN_I_FRAME' as const;

export type Actions =
  | typeof VideosInIFrame
  | typeof Close
  | typeof StartTranscript
  | typeof RemoveSubtitle
  | typeof AddSubtitle
  | typeof VideoCurrentTime
  | typeof StopTranscript
  | typeof GetBoundingClientRect
  | typeof VideoBoundingClientRect
  | typeof SetVideoTime
  | typeof RemoveVideoInIFrame;

type GenericEvent<T extends Actions> = {
  plusSubAction: T;
};

export type VideosInIFrameEvent = GenericEvent<typeof VideosInIFrame> & {
  frameSrc: string;
  videos: {
    currentSrc: string;
    hasSubtitle: boolean;
  }[]
};
export type VideosInIFrameUseWindowMessagePayload = {
  [VideosInIFrame]: (payload: MessageEvent<VideosInIFrameEvent>) => void;
};

export type RemoveVideoInIFrameEvent = GenericEvent<typeof RemoveVideoInIFrame> & {
  currentSrc: string;
  frameSrc: string;
};
export type RemoveVideoInIFrameEventUseWindowMessagePayload = {
  [RemoveVideoInIFrame]: (payload: MessageEvent<RemoveVideoInIFrameEvent>) => void;
};

export type CloseEvent = GenericEvent<typeof Close>;
export type CloseUseWindowMessagePayload = {
  [Close]: (payload: MessageEvent<CloseEvent>) => void;
};

export type AddSubtitleEvent = GenericEvent<typeof AddSubtitle> & {
  src: string;
  subtitle: SubtitleEntry[];
};
export type AddSubtitleEventUseWindowMessagePayload = {
  [AddSubtitle]: (payload: MessageEvent<AddSubtitleEvent>) => void;
};

export type RemoveSubtitleEvent = GenericEvent<typeof RemoveSubtitle>;
export type RemoveSubtitleEventUseWindowMessagePayload = {
  [RemoveSubtitle]: (payload: MessageEvent<RemoveSubtitleEvent>) => void;
};

export type GetBoundingClientRectEvent = GenericEvent<typeof GetBoundingClientRect>;
export type GetBoundingClientRectEventUseWindowMessagePayload = {
  [GetBoundingClientRect]: (payload: MessageEvent<GetBoundingClientRectEvent>) => void;
};

export type VideoBoundingClientRectEvent = GenericEvent<typeof VideoBoundingClientRect> & {
  boundingClientRect: DOMRect;
};
export type VideoBoundingClientRectEventUseWindowMessagePayload = {
  [VideoBoundingClientRect]: (payload: MessageEvent<VideoBoundingClientRectEvent>) => void;
};

export type StartTranscriptEvent = GenericEvent<typeof StartTranscript>;
export type StartTranscriptUseWindowMessagePayload = {
  [StartTranscript]: (payload: MessageEvent<StartTranscriptEvent>) => void;
};

export type StopTranscriptEvent = GenericEvent<typeof StopTranscript>;
export type StopTranscriptUseWindowMessagePayload = {
  [StopTranscript]: (payload: MessageEvent<StopTranscriptEvent>) => void;
};

export type VideoCurrentTimeEvent = GenericEvent<typeof VideoCurrentTime> & {
  currentTime: number;
};
export type VideoCurrentTimeUseWindowMessagePayload = {
  [VideoCurrentTime]: (payload: MessageEvent<VideoCurrentTimeEvent>) => void;
};

export type SetVideoTimeEvent = GenericEvent<typeof SetVideoTime> & {
  time: number;
};
export type SetVideoTimeUseWindowMessagePayload = {
  [SetVideoTime]: (payload: MessageEvent<SetVideoTimeEvent>) => void;
};

type AllUseWindowMessagePayload = VideosInIFrameUseWindowMessagePayload &
  CloseUseWindowMessagePayload &
  StartTranscriptUseWindowMessagePayload &
  RemoveSubtitleEventUseWindowMessagePayload &
  AddSubtitleEventUseWindowMessagePayload &
  VideoCurrentTimeUseWindowMessagePayload &
  StopTranscriptUseWindowMessagePayload &
  GetBoundingClientRectEventUseWindowMessagePayload &
  VideoBoundingClientRectEventUseWindowMessagePayload &
  SetVideoTimeUseWindowMessagePayload &
  RemoveVideoInIFrameEventUseWindowMessagePayload;

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
