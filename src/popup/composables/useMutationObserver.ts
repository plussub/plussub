import { onUnmounted, onMounted } from 'vue';

export const useMutationObserver = (callback: MutationCallback): void => {
  const observer = new MutationObserver(callback);

  onMounted(() => observer.observe(document.body, { subtree: true, childList: true }));

  onUnmounted(() => observer.disconnect());
};

export const useElementMutationObserver = (el: HTMLElement, options: MutationObserverInit, callback: MutationCallback): void => {
  const observer = new MutationObserver(callback);

  observer.observe(el, options);
};
