import { hot } from 'jest-marbles';
import { init } from '@/../contentScript/highlight';
import { isElementNotInViewport } from '@/../contentScript/highlight/isElementNotInViewport';
import { postMessage } from '@/../contentScript/postMessage';

jest.mock('@/../contentScript/postMessage', () => ({
  __esModule: true,
  postMessage: jest.fn()
}));

jest.mock('@/../contentScript/highlight/isElementNotInViewport', () => ({
  __esModule: true,
  isElementNotInViewport: jest.fn()
}));

describe('cs: highlight test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.scrollY = 0;
  });
  const highlightVideoActionFromPopup = { data: { plusSubActionFromPopup: 'HIGHLIGHT_VIDEO' } };
  const removeHighlightVideoActionFromPopup = { data: { plusSubActionFromPopup: 'REMOVE_HIGHLIGHT_FROM_VIDEO' } };
  const unrelatedEventFromPopup = { data: { plusSubActionFromPopup: 'UNRELATED' } };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const createHtmlElement = (): HTMLVideoElement => ({
      getBoundingClientRect: () => ({ top: 100, left: 100, height: 100, width: 100 }),
      scrollIntoView: jest.fn(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.scrollY = 1000;
      })
    }) as HTMLVideoElement;

  describe('highlight', () => {
    it('should emit not emit (el is null)', async () => {
      const observable = init({
        messageObservable: hot('--1--', { 1: highlightVideoActionFromPopup }),
        getElementFrom: jest.fn().mockReturnValue(null)
      });
      expect(observable).toBeObservable(hot('-----'));
    });

    it('should emit but should not adjust popup because element is in viewport', async () => {
      (isElementNotInViewport as jest.Mock).mockReturnValue(false);
      const htmlElement = createHtmlElement();

      const observable = init({
        messageObservable: hot('--1--', { 1: highlightVideoActionFromPopup }),
        getElementFrom: jest.fn().mockReturnValue(htmlElement)
      });

      expect(observable).toBeObservable(
        hot('--1--', {
          1: {
            messageEvent: highlightVideoActionFromPopup,
            el: htmlElement
          }
        })
      );

      expect(observable).toSatisfyOnFlush(() => {
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-width')).toEqual('100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-height')).toEqual('100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-top')).toEqual('100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-left')).toEqual('100px');
        expect(postMessage).not.toHaveBeenCalled();
      });
    });

    it('should emit and should adjust popup because element is not viewport', async () => {
      (isElementNotInViewport as jest.Mock).mockReturnValue(true);
      const htmlElement = createHtmlElement();

      const observable = init({
        messageObservable: hot('--1--', { 1: highlightVideoActionFromPopup }),
        getElementFrom: jest.fn().mockReturnValue(htmlElement)
      });

      expect(observable).toBeObservable(
        hot('--1--', {
          1: {
            messageEvent: highlightVideoActionFromPopup,
            el: htmlElement
          }
        })
      );

      expect(observable).toSatisfyOnFlush(() => {
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-width')).toEqual('100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-height')).toEqual('100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-top')).toEqual('1100px');
        expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-left')).toEqual('100px');
        expect(postMessage).toHaveBeenCalledWith({ plusSubActionFromContentScript: 'ADJUST_POPUP' });
      });
    });
  });

  it('remove highlight', async () => {
    const observable = init({
      messageObservable: hot('--1--', { 1: removeHighlightVideoActionFromPopup }),
      getElementFrom: jest.fn().mockReturnValue(null)
    });
    expect(observable).toBeObservable(
      hot('--1--', {
        1: removeHighlightVideoActionFromPopup
      })
    );
    expect(observable).toSatisfyOnFlush(() => {
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-width')).toEqual('0px');
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-height')).toEqual('0px');
    });
  });

  it('should emit not emit (wrong message)', async () => {
    const observable = init({
      messageObservable: hot('--1--', { 1: unrelatedEventFromPopup }),
      getElementFrom: jest.fn().mockReturnValue(null)
    });
    expect(observable).toBeObservable(hot('-----'));
  });

  it('highlight then unrelated event then remove highlight', () => {
    (isElementNotInViewport as jest.Mock).mockReturnValue(false);
    const htmlElement = createHtmlElement();

    const observable = init({
      messageObservable: hot('--1-2-3-', {
        1: highlightVideoActionFromPopup,
        2: unrelatedEventFromPopup,
        3: removeHighlightVideoActionFromPopup
      }),
      getElementFrom: jest.fn().mockReturnValue(htmlElement)
    });

    expect(observable).toBeObservable(
      hot('--1---3-', {
        1: {
          messageEvent: highlightVideoActionFromPopup,
          el: htmlElement
        },
        3: removeHighlightVideoActionFromPopup
      })
    );

    expect(observable).toSatisfyOnFlush(() => {
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-width')).toEqual('0px');
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-height')).toEqual('0px');
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-top')).toEqual('100px');
      expect(document.documentElement.style.getPropertyValue('--plusSub-video-highlight-left')).toEqual('100px');
      expect(postMessage).not.toHaveBeenCalled();
    });
  });
});
