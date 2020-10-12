export type VideoSrc = string;
export interface Video {
  src: string;
  frameSrc: string;
  origin: string;
  hasSubtitle: boolean;
  in: 'I_FRAME' | 'HOST';
  el?: HTMLVideoElement
}
