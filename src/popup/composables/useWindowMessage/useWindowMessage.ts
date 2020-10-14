import {AllEvents, UseWindowMessagePayload} from "@/composables/useWindowMessage/types";
import {onMounted, onUnmounted} from "vue";

type HandleMessageFunction = (e: MessageEvent<AllEvents>) => void;

export const useWindowMessage = (useWindowMessagePayload: UseWindowMessagePayload): HandleMessageFunction => {
  const handleMessage = (e: MessageEvent<AllEvents>): void => {
    const { data } = e;
    if (!data.plusSubAction) {
      return;
    }

    if (data.plusSubAction === 'REMOVE_MESSAGE_EVENT_LISTENER') {
      window.removeEventListener('message', handleMessage);
    }

    const cb = useWindowMessagePayload[data.plusSubAction];
    if (cb) {
      // messed up with the typescript types here...
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cb(e);
    }
  };

  onMounted(() => window.addEventListener('message', handleMessage));
  onUnmounted(() => window.removeEventListener('message', handleMessage));
  return handleMessage;
};
