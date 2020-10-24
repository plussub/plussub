import {useIFrameApp} from "@/inIFrame";

export const close = (): void => {
  const app = useIFrameApp();
  const appDiv = document.getElementById('plussubShadow')?.shadowRoot?.getElementById('plussub');
  // unmount app otherwise watch will continue to work
  app.unmount(appDiv as Element);

  document.getElementById('plussubShadow')?.remove();
  document.getElementById('plussub-overlay-highlight')?.remove();
  window.postMessage({ plusSubAction: 'removeMessageEventListener' }, '*');
};
