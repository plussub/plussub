import { SubtitleEntry } from '@/subtitle/state/types';

export const VideoInIFrame = 'VIDEO_IN_I_FRAME' as const;
export const RemoveMessageEventListener = 'REMOVE_MESSAGE_EVENT_LISTENER' as const;
export const StartTranscript = 'START_TRANSCRIPT' as const;
export const StopTranscript = 'STOP_TRANSCRIPT' as const;
export const VideoCurrentTime = 'VIDEO_CURRENT_TIME' as const;
export const SetVideoTime = 'SET_VIDEO_TIME' as const;
export const AddSubtitle = 'ADD_SUBTITLE' as const;
export const RemoveSubtitle = 'REMOVE_SUBTITLE' as const;
export const GetBoundingClientRect = 'Get_Bounding_Client_Rect' as const;
export const VideoBoundingClientRect = 'Video_Bounding_Client_Rect' as const;

export type Actions =
  | typeof VideoInIFrame
  | typeof RemoveMessageEventListener
  | typeof StartTranscript
  | typeof RemoveSubtitle
  | typeof AddSubtitle
  | typeof VideoCurrentTime
  | typeof StopTranscript
  | typeof GetBoundingClientRect
  | typeof VideoBoundingClientRect
  | typeof SetVideoTime;

type GenericEvent<T extends Actions> = {
  plusSubAction: T;
};

export type VideoInIFrameEvent = GenericEvent<typeof VideoInIFrame> & {
  frameSrc: string;
  src: string;
  hasSubtitle: boolean;
};
export type SendIFrameUseWindowMessagePayload = {
  [VideoInIFrame]: (payload: MessageEvent<VideoInIFrameEvent>) => void;
};

export type RemoveMessageEventListenerEvent = GenericEvent<typeof RemoveMessageEventListener>;
export type RemoveMessageEventListenerUseWindowMessagePayload = {
  [RemoveMessageEventListener]: (payload: MessageEvent<RemoveMessageEventListenerEvent>) => void;
};

export type AddSubtitleEvent = GenericEvent<typeof AddSubtitle> & {
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

type AllUseWindowMessagePayload = SendIFrameUseWindowMessagePayload &
  RemoveMessageEventListenerUseWindowMessagePayload &
  StartTranscriptUseWindowMessagePayload &
  RemoveSubtitleEventUseWindowMessagePayload &
  AddSubtitleEventUseWindowMessagePayload &
  VideoCurrentTimeUseWindowMessagePayload &
  StopTranscriptUseWindowMessagePayload &
  GetBoundingClientRectEventUseWindowMessagePayload &
  VideoBoundingClientRectEventUseWindowMessagePayload &
  SetVideoTimeUseWindowMessagePayload;

export type UseWindowMessagePayload = Partial<AllUseWindowMessagePayload>;
export type AllEvents =
  | VideoInIFrameEvent
  | RemoveMessageEventListenerEvent
  | StartTranscriptEvent
  | StopTranscriptEvent
  | RemoveSubtitleEvent
  | GetBoundingClientRectEvent
  | VideoBoundingClientRectEvent
  | AddSubtitleEvent
  | VideoCurrentTimeEvent
  | SetVideoTimeEvent;
