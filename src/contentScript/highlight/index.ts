import { filter, map, tap } from 'rxjs/operators';
import { postMessage } from '../postMessage';
import { Observable, merge, partition } from 'rxjs';
import { ContentScriptInputMessageEvent, EXTENSION_ORIGIN, GenericContentScriptInputMessageEvent } from '../types';
import { isElementNotInViewport } from './isElementNotInViewport';

interface Payload {
  inputObservable: Observable<GenericContentScriptInputMessageEvent>;
  getVideoElementFrom: (id: string) => HTMLVideoElement | null;
}

type HighlightVideoMessageEvent = ContentScriptInputMessageEvent<'HIGHLIGHT_VIDEO', { id: string }>;

export const init = ({ inputObservable, getVideoElementFrom }: Payload): Observable<{ el: HTMLVideoElement; messageEvent: HighlightVideoMessageEvent } | ContentScriptInputMessageEvent<'REMOVE_HIGHLIGHT_FROM_VIDEO', Record<string, unknown>>> => {
  const overlayHighlight = document.createElement('div');
  overlayHighlight.id = `${EXTENSION_ORIGIN}-overlay-highlight`;
  overlayHighlight.style.position = 'absolute';
  overlayHighlight.style.zIndex = '9999';
  overlayHighlight.style.backgroundColor = 'rgba(40, 58, 90, 0.8)';
  overlayHighlight.style.width = `var(--${EXTENSION_ORIGIN}-video-highlight-width, 0px)`;
  overlayHighlight.style.height = `var(--${EXTENSION_ORIGIN}-video-highlight-height, 0px)`;
  overlayHighlight.style.top = `var(--${EXTENSION_ORIGIN}-video-highlight-top, 0px)`;
  overlayHighlight.style.left = `var(--${EXTENSION_ORIGIN}-video-highlight-left, 0px)`;
  document.body.prepend(overlayHighlight);

  const highlightVideoObservable = inputObservable.pipe(
    filter((e): e is HighlightVideoMessageEvent => e.data.contentScriptInput === 'HIGHLIGHT_VIDEO'),
    map<HighlightVideoMessageEvent, { el: HTMLVideoElement | null; messageEvent: HighlightVideoMessageEvent }>((messageEvent) => ({
      el: getVideoElementFrom(messageEvent.data.id),
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
      postMessage({ contentScriptOutput: 'ADJUST_POPUP' });
    })
  )

  const highlightInputObservable = merge(scrollIntoViewObservable, inViewportObservable).pipe(
    tap(({ el }) => {
      const { top, left, height, width } = el.getBoundingClientRect();
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-width`, `${width}px`);
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-height`, `${height}px`);
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-top`, `${window.scrollY + top}px`);
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-left`, `${window.scrollX + left}px`);
    })
  );

  const removeHighlightInputObservable = inputObservable.pipe(
    filter(
      (e): e is ContentScriptInputMessageEvent<'REMOVE_HIGHLIGHT_FROM_VIDEO', Record<string, unknown>> => e.data.contentScriptInput === 'REMOVE_HIGHLIGHT_FROM_VIDEO'
    ),
    tap(() => {
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-width`, '0px');
      document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-video-highlight-height`, '0px');
    })
  );

  return merge(highlightInputObservable, removeHighlightInputObservable);
};
