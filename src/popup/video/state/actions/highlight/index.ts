import { srcToGlobalVideo, Video } from '@/video/state';
import { highlightVideoInHost } from '@/video/state/actions/highlight/host';
import { highlightVideoInIFrame } from '@/video/state/actions/highlight/iframe';
// import { currentSelectedVideoSrc } from '@/navigation/state';

interface HighlightVideoPayload {
  video?: Video;
}

export const highlightVideo = ({ video }: HighlightVideoPayload): void => {
  if (video?.in === 'HOST') {
    highlightVideoInHost(video);
  } else if (video?.in === 'I_FRAME') {
    highlightVideoInIFrame(video);
  } else {
    return;
  }
};

export const highlightCurrentVideo = (): void => {
  // todo current selected video src
  // if (!currentSelectedVideoSrc.value) {
  //   return;
  // }
  // highlightVideo({ video: srcToGlobalVideo.value[currentSelectedVideoSrc.value] });
};

export const removeHighlightFromVideo = (): void => {
  const overlayHightlight = document.getElementById('plussub-overlay-highlight');
  if (!overlayHightlight) {
    return;
  }
  overlayHightlight.style.cssText = `width: 0px; height: 0px;`;
};
