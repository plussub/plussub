import { filter, map, tap } from 'rxjs/operators';
import { postMessage } from '../postMessage';
import { Observable, merge, partition } from 'rxjs';
import { MessageEventFromPopup } from '../types';
import { isElementNotInViewport } from './isElementNotInViewport';

interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
  getElementFrom: (id: string) => HTMLVideoElement | null;
}

type HighlightVideoMessageEvent = MessageEventFromPopup<'HIGHLIGHT_VIDEO'> & { data: { id: string } };

export const init = ({ messageObservable, getElementFrom }: Payload): Observable<{ el: HTMLVideoElement; messageEvent: HighlightVideoMessageEvent } | MessageEventFromPopup<'REMOVE_HIGHLIGHT_FROM_VIDEO'>> => {
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

  const highlightVideoObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, HighlightVideoMessageEvent>((e): e is HighlightVideoMessageEvent => e.data.plusSubActionFromPopup === 'HIGHLIGHT_VIDEO'),
    map<HighlightVideoMessageEvent, { el: HTMLVideoElement | null; messageEvent: HighlightVideoMessageEvent }>((messageEvent) => ({
      el: getElementFrom(messageEvent.data.id),
      messageEvent
    })),
    filter<{ el: HTMLVideoElement | null; messageEvent: HighlightVideoMessageEvent }, { el: HTMLVideoElement; messageEvent: HighlightVideoMessageEvent }>(
      (value): value is { el: HTMLVideoElement; messageEvent: HighlightVideoMessageEvent } => value.el !== null
    )
  );

  const [notInViewportObservable, inViewportObservable] = partition(highlightVideoObservable, ({ el }) => isElementNotInViewport(el));
  const scrollIntoViewObservable = notInViewportObservable.pipe(
    tap(({ el }) => {
      el.scrollIntoView({ block: 'center' });
      postMessage({ plusSubActionFromContentScript: 'ADJUST_POPUP' });
    })
  )

  const highlightObservable = merge(scrollIntoViewObservable, inViewportObservable).pipe(
    tap(({ el }) => {
      const { top, left, height, width } = el.getBoundingClientRect();
      document.documentElement.style.setProperty('--plusSub-video-highlight-width', `${width}px`);
      document.documentElement.style.setProperty('--plusSub-video-highlight-height', `${height}px`);
      document.documentElement.style.setProperty('--plusSub-video-highlight-top', `${window.scrollY + top}px`);
      document.documentElement.style.setProperty('--plusSub-video-highlight-left', `${window.scrollX + left}px`);
    })
  );

  const removeHighlightObservable = messageObservable.pipe(
    filter<MessageEventFromPopup<string>, MessageEventFromPopup<'REMOVE_HIGHLIGHT_FROM_VIDEO'>>(
      (e): e is MessageEventFromPopup<'REMOVE_HIGHLIGHT_FROM_VIDEO'> => e.data.plusSubActionFromPopup === 'REMOVE_HIGHLIGHT_FROM_VIDEO'
    ),
    tap(() => {
      document.documentElement.style.setProperty('--plusSub-video-highlight-width', '0px');
      document.documentElement.style.setProperty('--plusSub-video-highlight-height', '0px');
    })
  );

  return merge(highlightObservable, removeHighlightObservable);
};
