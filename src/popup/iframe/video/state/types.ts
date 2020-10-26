export type VideoSrc = string;
export interface Video {
  src: string;
  hasSubtitle: boolean;
  el?: HTMLVideoElement
}
