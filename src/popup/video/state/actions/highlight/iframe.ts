import { srcToIFrameSource, Video } from '@/video/state';
import { GetBoundingClientRect, postWindowMessage, VideoBoundingClientRect } from '@/composables';
// import { appState } from '@/app/state';
import { isElementNotInViewport } from '@/video/state/actions/highlight/isElementNotInViewport';

export const highlightVideoInIFrame = (video: Video): void => {
  const el = document.querySelector(`iframe[src="${srcToIFrameSource[video.src].frameSrc}"]`);
  if (!el) {
    return;
  }

  if (isElementNotInViewport(el)) {
    el.scrollIntoView({ block: 'center' });
    const plussubShadow = document.getElementById('plussubShadow');
    if (!plussubShadow) {
      return;
    }
    plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
  }

  const overlayHighlight = document.getElementById('plussub-overlay-highlight');
  if (!overlayHighlight) {
    return;
  }
  console.warn('before declare');

  // Not use useWindowMessage as I want to remove event listener immediately
  // todo: implement once
  const handleMessageInPageVideos = (e) => {
    //todo appstore
    // if (appState.value.state !== 'NONE') {
    //   return;
    // }
    const { plusSubAction, boundingClientRect } = e.data;
    if (plusSubAction === VideoBoundingClientRect) {
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
  postWindowMessage({
    window: srcToIFrameSource[video.src].window,
    origin: srcToIFrameSource[video.src].origin,
    payload: {
      plusSubAction: GetBoundingClientRect,
      src: video.src
    }
  });
};
