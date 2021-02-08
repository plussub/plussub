import {Observable} from "rxjs";
import {isHTMLElement, isHTMLVideoElement} from "@/types";

const findVideoElement = (nodes: Node[]):HTMLVideoElement[] => {
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


export const create = (): Observable<{added: HTMLVideoElement[], removed: HTMLVideoElement[]}> => {
  return new Observable((subscriber) => {
    const mutationObserver = new MutationObserver((mutationsList) => {
      const added = addedVideoElements(mutationsList);
      const removed = removedVideoElements(mutationsList);
      if (added.length || removed.length) {
        subscriber.next({
          added,
          removed
        });
      }
    });
    mutationObserver.observe(document.body, { subtree: true, childList: true });
    return () => mutationObserver.disconnect();
  });
};
