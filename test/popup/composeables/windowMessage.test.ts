import {
  useWindowMessage,
  SendIFrame,
  SendIFrameEvent,
  UseWindowMessagePayload,
  RemoveMessageEventListener
} from "@/composables/useWindowMessage";

describe('window message test', () => {
  it('single callback', () => {
    const payload: UseWindowMessagePayload = {
      [SendIFrame]: jest.fn(),
      [RemoveMessageEventListener]: jest.fn()
    };

    const underTest = useWindowMessage(payload);

    underTest({
      origin: 'origin',
      data: {
        plusSubAction: 'SEND_I_FRAME_SRC',
        src: 'test',
        hasSubtitle: true
      }
    } as MessageEvent<SendIFrameEvent>);

    expect(payload.SEND_I_FRAME_SRC).toHaveBeenCalledWith({
      origin: 'origin',
      data: {
        plusSubAction: 'SEND_I_FRAME_SRC',
        src: 'test',
        hasSubtitle: true
      }
    });
    expect(payload.REMOVE_MESSAGE_EVENT_LISTENER).not.toHaveBeenCalled();
  });
});
