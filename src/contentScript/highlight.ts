import {filter} from "rxjs/operators";
import {postMessage} from "./postMessage";
import { Observable } from 'rxjs';

const isElementNotInViewport = (el: Element) => el.getBoundingClientRect().top >= (window.innerHeight || document.documentElement.clientHeight) || el.getBoundingClientRect().bottom <= 0;

interface Payload {
  messageObservable: Observable<MessageEvent>,
  getElementFrom: (id: string) => HTMLVideoElement |null;
}

export const init = ({messageObservable, getElementFrom}: Payload): void => {

  const overlayHighlight = document.createElement('div');
  overlayHighlight.id = 'plusSub-overlay-highlight';
  overlayHighlight.style.position = 'absolute';
  overlayHighlight.style.zIndex = '9999';
  overlayHighlight.style.backgroundColor = 'rgba(40, 58, 90, 0.8)';
  overlayHighlight.style.width = 'var(--plusSub-video-highlight-width, 0px)';
  overlayHighlight.style.height = 'var(--plusSub-video-highlight-height, 0px)';
  overlayHighlight.style.top = 'var(--plusSub-video-highlight-top, 0px)';
  overlayHighlight.style.left = 'var(--plusSub-video-highlight-left, 0px)';
  document.body.prepend(overlayHighlight);

  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; id: string }>>(filter((e) => e.data.plusSubActionFromPopup === 'HIGHLIGHT_VIDEO')).subscribe((e) => {
    const el = getElementFrom(e.data.id);
    if (!el) {
      return;
    }

    if (isElementNotInViewport(el)) {
      el.scrollIntoView({ block: 'center' });
      postMessage({ plusSubActionFromContentScript: 'ADJUST_POPUP' });
    }

    const { top, left, height, width } = el.getBoundingClientRect();
    document.documentElement.style.setProperty('--plusSub-video-highlight-width', `${width}px`);
    document.documentElement.style.setProperty('--plusSub-video-highlight-height', `${height}px`);
    document.documentElement.style.setProperty('--plusSub-video-highlight-top', `${window.scrollY + top}px`);
    document.documentElement.style.setProperty('--plusSub-video-highlight-left', `${window.scrollX + left}px`);
  });

  messageObservable.pipe<MessageEvent<{ plusSubActionFromPopup: string; id: string }>>(filter((e) => e.data.plusSubActionFromPopup === 'REMOVE_HIGHLIGHT_FROM_VIDEO')).subscribe((e) => {
    document.documentElement.style.setProperty('--plusSub-video-highlight-width', '0px');
    document.documentElement.style.setProperty('--plusSub-video-highlight-height', '0px');
  });
}
