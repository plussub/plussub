import {
  useWindowMessage,
  VideosInIFrame,
  VideosInIFrameEvent,
  UseWindowMessagePayload,
  RemoveMessageEventListener
} from "@/composables/useWindowMessage";

describe('window message test', () => {
  it('single callback', () => {
    const payload: UseWindowMessagePayload = {
      [VideosInIFrame]: jest.fn(),
      [RemoveMessageEventListener]: jest.fn()
    };

    const underTest = useWindowMessage(payload);

    underTest({
      origin: 'origin',
      data: {
        plusSubAction: VideosInIFrame,
        videos: [{
          currentSrc: 'test',
          hasSubtitle: true
        }]
      }
    } as MessageEvent<VideosInIFrameEvent>);

    expect(payload[VideosInIFrame]).toHaveBeenCalledWith({
      origin: 'origin',
      data: {
        plusSubAction: 'VIDEOS_IN_I_FRAME',
        videos: [{
          currentSrc: 'test',
          hasSubtitle: true
        }]
      }
    });
    expect(payload.REMOVE_MESSAGE_EVENT_LISTENER).not.toHaveBeenCalled();
  });
});
