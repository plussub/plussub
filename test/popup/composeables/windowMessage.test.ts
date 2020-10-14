import {
  useWindowMessage,
  VideoInIFrame,
  VideoInIFrameEvent,
  UseWindowMessagePayload,
  RemoveMessageEventListener
} from "@/composables/useWindowMessage";

describe('window message test', () => {
  it('single callback', () => {
    const payload: UseWindowMessagePayload = {
      [VideoInIFrame]: jest.fn(),
      [RemoveMessageEventListener]: jest.fn()
    };

    const underTest = useWindowMessage(payload);

    underTest({
      origin: 'origin',
      data: {
        plusSubAction: VideoInIFrame,
        src: 'test',
        hasSubtitle: true
      }
    } as MessageEvent<VideoInIFrameEvent>);

    expect(payload[VideoInIFrame]).toHaveBeenCalledWith({
      origin: 'origin',
      data: {
        plusSubAction: 'VIDEO_IN_I_FRAME',
        src: 'test',
        hasSubtitle: true
      }
    });
    expect(payload.REMOVE_MESSAGE_EVENT_LISTENER).not.toHaveBeenCalled();
  });
});
