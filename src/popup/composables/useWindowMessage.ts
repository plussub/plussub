import { onUnmounted, onMounted } from 'vue';

export const SendIFrame = 'SEND_I_FRAME_SRC' as const;

export type SendIFrameEvent = {
  plusSubAction: typeof SendIFrame;
  frameSrc: string;
  src: string;
  hasSubtitle: boolean;
};
type SendIFrameUseWindowMessagePayload = {
  [SendIFrame]: (payload: MessageEvent<SendIFrameEvent>) => void;
}

export const RemoveMessageEventListener = 'REMOVE_MESSAGE_EVENT_LISTENER' as const;
export type RemoveMessageEventListenerEvent = {
  plusSubAction: typeof RemoveMessageEventListener
};
type RemoveMessageEventListenerUseWindowMessagePayload = {
  [RemoveMessageEventListener]: (payload: MessageEvent<RemoveMessageEventListenerEvent>) => void;
}

export type Actions = typeof SendIFrame | typeof RemoveMessageEventListener;
export type UseWindowMessagePayload = Partial<SendIFrameUseWindowMessagePayload & RemoveMessageEventListenerUseWindowMessagePayload>

type AllEvents = SendIFrameEvent | RemoveMessageEventListenerEvent;

type HandleMessageFunction = (e: MessageEvent<SendIFrameEvent | RemoveMessageEventListenerEvent>) => void;

export const useWindowMessage = (useWindowMessagePayload: UseWindowMessagePayload): HandleMessageFunction => {
  const handleMessage = (e: MessageEvent<SendIFrameEvent | RemoveMessageEventListenerEvent>): void => {
    const {data} = e;
    if(!data.plusSubAction){
      return;
    }

    if(data.plusSubAction === 'REMOVE_MESSAGE_EVENT_LISTENER'){
      window.removeEventListener('message', handleMessage);
    }
    const cb = useWindowMessagePayload[data.plusSubAction];
    if(cb){
      // todo fix type definition
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cb(e);
    }
  };

  onMounted(() => window.addEventListener('message', handleMessage));
  onUnmounted(() => window.removeEventListener('message', handleMessage));
  return handleMessage;
};

// export const postWindowMessage = (message: AllEvents): void => {
//   window.postMessage(message);
// };
