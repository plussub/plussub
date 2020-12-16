import { Video } from '@/video/state';
import { isElementNotInViewport } from '@/video/state/actions/highlight/isElementNotInViewport';

export const highlightVideoInHost = (video: Video): void => {
  if (!video.el) {
    return;
  }

  if (isElementNotInViewport(video.el)) {
    video.el.scrollIntoView({ block: 'center' });
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

  const { top, left, height, width } = video.el.getBoundingClientRect();
  overlayHighlight.style.cssText = `position: absolute; z-index: 9999; background-color: rgba(40, 58, 90, 0.8); width: ${width}px; height: ${height}px; top: ${window.scrollY + top}px; left: ${
    window.scrollX + left
  }px;`;
};
