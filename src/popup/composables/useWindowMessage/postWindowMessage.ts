import {AllEvents} from "@/composables/useWindowMessage/types";

interface PostWindowMessagePayload {
  window: Window | null | undefined;
  origin: string;
  payload: AllEvents;
}

export const postWindowMessage = ({ window, origin, payload }: PostWindowMessagePayload): void => {
  if (!window) {
    return;
  }
  window.postMessage(payload, origin);
};
