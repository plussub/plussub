import { srcToIFrameSource, Video } from '@/video/state';
import { postWindowMessage, GetBoundingClientRect } from '@/composables/useWindowMessage';

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

export const enterVideo = (video: Video): void => {
  if (!video) return;
  const el = video.in === 'HOST' ? video.el : document.querySelector(`iframe[src="${srcToIFrameSource[video.src].frameSrc}"]`);
  if (!el) return;
  if (isElementNotInViewport(el)) {
    el.scrollIntoView({ block: 'center' });
    const plussubShadow = document.getElementById('plussubShadow');
    if (!plussubShadow) return;
    plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
  }
  const overlayHighlight = document.getElementById('plussub-overlay-highlight');
  if (!overlayHighlight) return;
  if (video.in === 'HOST') {
    const { top, left, height, width } = el.getBoundingClientRect();
    overlayHighlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${window.scrollY + top}px; left: ${
      window.scrollX + left
    }px;`;
  } else {
    postWindowMessage({
      window: srcToIFrameSource[video.src].window,
      origin: srcToIFrameSource[video.src].origin,
      payload: {
        plusSubAction: GetBoundingClientRect
      }
    });
    // Not use useWindowMessage as I want to remove event listener immediately
    // todo: implement once
    const handleMessageInPageVideos = (e) => {
      const { plusSubAction, boundingClientRect } = e.data;
      if (plusSubAction === 'Video_Bounding_Client_Rect') {
        window.removeEventListener('message', handleMessageInPageVideos);
        const iframeBoundingClientRect = el.getBoundingClientRect();
        const iFrameTop = iframeBoundingClientRect.top;
        const iFrameLeft = iframeBoundingClientRect.left;
        const { top, left, height, width } = boundingClientRect;
        overlayHighlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${
          window.scrollY + top + iFrameTop
        }px; left: ${window.scrollX + left + iFrameLeft}px;`;
      }
    };
    window.addEventListener('message', handleMessageInPageVideos);
  }
};

export const leaveVideo = (): void => {
  const overlayHightlight = document.getElementById('plussub-overlay-highlight');
  if (!overlayHightlight) return;
  overlayHightlight.style.cssText = `width: 0px; height: 0px;`;
};
