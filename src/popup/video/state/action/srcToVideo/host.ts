import { srcToVideo } from '@/video/state/state';
import { reset } from '@/app/state';

export const addSrcToVideoInHost = (el: HTMLVideoElement): void => {
  const { src } = el;
  srcToVideo.value[src] = { el, hasSubtitle: el.classList.contains('plussub'), src, in: 'HOST' };
};

export const removeSrcToVideoInHost = (src: string): void => {
  if (srcToVideo.value[src] && srcToVideo.value[src].hasSubtitle) reset();
  delete srcToVideo.value[src];
};
