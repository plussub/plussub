export interface NavigationState {
  name: 'HOME' | 'SEARCH' | 'SUBTITLE-SELECTION' | 'TRANSCRIPT',
  params: any
}
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
  tmdb_id: string,
  media_type: string,
  searchQuery: string,
  contentTransitionName: 'content-navigate-deeper'
}
