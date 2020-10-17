import { onUnmounted, onMounted } from 'vue';

export const useMutationObserver = (el: HTMLElement, options: MutationObserverInit, callback: MutationCallback): void => {
  const observer = new MutationObserver(callback);

  onMounted(() => observer.observe(el, options));

  onUnmounted(() => observer.disconnect());
};
