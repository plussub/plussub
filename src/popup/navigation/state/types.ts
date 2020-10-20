export interface NavigationState {
  name: 'HOME' | 'SEARCH' | 'SUBTITLE-SELECTION' | 'TRANSCRIPT',
  params: any
}
export interface ToHomePayload {
  contentTransitionName: 'content-navigate-shallow' | 'content-navigate-select-to-home';
}

export interface ToSearchPayload {
  contentTransitionName: 'content-navigate-deeper';
}
