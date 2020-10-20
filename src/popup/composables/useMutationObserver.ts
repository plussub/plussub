import { onUnmounted, onMounted } from 'vue';

export const useMutationObserver = (callback: MutationCallback): void => {
  const observer = new MutationObserver(callback);

  onMounted(() => observer.observe(document.body, { subtree: true, childList: true }));

  onUnmounted(() => observer.disconnect());
};

// todo: missing lifecycle methods, who ensures release of the observer
export const useElementMutationObserver = (el: HTMLElement, options: MutationObserverInit, callback: MutationCallback): void => {
  const observer = new MutationObserver(callback);

  observer.observe(el, options);

  // (warning when use with onMount or onUnmount): onMount(onUnmount) is called when there is no active component instance to be associated with.
};
