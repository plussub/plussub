import { onMounted, onUnmounted } from 'vue';
import {isHTMLElement, isHTMLVideoElement} from "@/types";

const findVideoElement = (nodes: Node[]) => {
  const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
  if (directMatch) {
    return [directMatch];
  }
  return nodes.reduce<HTMLVideoElement[]>((acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video'))] : acc), []);
};

const addedVideoElements = (mutationsList: MutationRecord[]): HTMLVideoElement[] => {
  return mutationsList.flatMap((mutation) => findVideoElement(Array.from(mutation.addedNodes)));
};

const removedVideoElements = (mutationsList: MutationRecord[]): HTMLVideoElement[] => {
  return mutationsList.flatMap((mutation) => findVideoElement(Array.from(mutation.removedNodes)));
};

interface CallbackPayload {
  added: HTMLVideoElement[];
  removed: HTMLVideoElement[];
}

export const useVideoElementMutationObserver = (callback: (payload: CallbackPayload) => void): void => {
  const observer = new MutationObserver((mutationsList) => {
    callback({
      added: addedVideoElements(mutationsList),
      removed: removedVideoElements(mutationsList)
    });
  });

  onMounted(() => observer.observe(document.body, { subtree: true, childList: true }));
  onUnmounted(() => observer.disconnect());
};
