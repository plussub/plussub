import {SubtitleEntry} from "@/subtitle/state/types";

export const VideoInIFrame = 'VIDEO_IN_I_FRAME' as const;
export const RemoveMessageEventListener = 'REMOVE_MESSAGE_EVENT_LISTENER' as const;
export const StartTranscript = 'START_TRANSCRIPT' as const;
export const AddSubtitle = 'ADD_SUBTITLE' as const;
export const RemoveSubtitle = 'REMOVE_SUBTITLE' as const;

export type Actions = typeof VideoInIFrame | typeof RemoveMessageEventListener | typeof StartTranscript | typeof RemoveSubtitle | typeof AddSubtitle

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
  subtitle: SubtitleEntry[]
}
export type AddSubtitleEventUseWindowMessagePayload = {
  [AddSubtitle]: (payload: MessageEvent<AddSubtitleEvent>) => void;
};


export type RemoveSubtitleEvent = GenericEvent<typeof RemoveSubtitle>;
export type RemoveSubtitleEventUseWindowMessagePayload = {
  [RemoveSubtitle]: (payload: MessageEvent<RemoveSubtitleEvent>) => void;
};

export type StartTranscriptEvent = GenericEvent<typeof StartTranscript> & {
  currentTime: number;
};
export type StartTranscriptUseWindowMessagePayload = {
  [StartTranscript]: (payload: MessageEvent<StartTranscriptEvent>) => void;
};

type AllUseWindowMessagePayload = SendIFrameUseWindowMessagePayload &
  RemoveMessageEventListenerUseWindowMessagePayload &
  StartTranscriptUseWindowMessagePayload &
  RemoveSubtitleEventUseWindowMessagePayload &
  AddSubtitleEventUseWindowMessagePayload

export type UseWindowMessagePayload = Partial<AllUseWindowMessagePayload>;
export type AllEvents = VideoInIFrameEvent | RemoveMessageEventListenerEvent | StartTranscriptEvent | RemoveSubtitleEvent | AddSubtitleEvent
