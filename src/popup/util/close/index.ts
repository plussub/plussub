export const close = (): void => {
  document.getElementById('plussubShadow')?.remove();
  document.getElementById('plussub-overlay-highlight')?.remove();
  window.postMessage({ plusSubAction: 'removeMessageEventListener' }, '*');
};
