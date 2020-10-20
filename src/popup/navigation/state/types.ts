import { Ref } from 'vue';
import {VideoSrc} from "@/video/state";

export type NavigationState = Ref<{
  name: 'HOME' | 'SEARCH' | 'SUBTITLE-SELECTION' | 'TRANSCRIPT';
  params: any;
}>;

export type CurrentSelectedSrcState = Ref<VideoSrc | null>;

export interface ToHomePayload {
  contentTransitionName: 'content-navigate-shallow' | 'content-navigate-select-to-home';
}

export interface ToTranscriptPayload {
  contentTransitionName: 'content-navigate-deeper';
}

export interface ToSearchPayload {
  contentTransitionName: 'content-navigate-deeper' | 'content-navigate-shallow';
  query?: string;
}

export interface ToSubtitleSelectionPayload {
  tmdb_id: string;
  media_type: string;
  searchQuery: string;
  contentTransitionName: 'content-navigate-deeper';
}
