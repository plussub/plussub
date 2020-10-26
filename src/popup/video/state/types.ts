export type VideoSrc = string;
export interface Video {
  src: string;
  hasSubtitle: boolean;
  in: 'I_FRAME' | 'HOST';
  el?: HTMLVideoElement
}
export interface IFrameSource {
  window: Window;
  frameSrc: string;
  origin: string;
}
