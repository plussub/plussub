import { useApp } from '@/inHost';
import { postWindowMessage } from '@/composables';
import { srcToIFrameSource } from '@/video/store';

export const close = (): void => {
  Object.values(srcToIFrameSource).forEach((iFrameSource) => {
    postWindowMessage({
      window: iFrameSource.window,
      origin: iFrameSource.origin,
      payload: {
        plusSubAction: 'CLOSE'
      }
    });
  });
  const app = useApp();
  const appDiv = document.getElementById('plussubShadow')?.shadowRoot?.getElementById('plussub');
  // unmount app otherwise watch will continue to work
  app.unmount(appDiv as Element);

  document.getElementById('plussubShadow')?.remove();
  document.getElementById('plussub-overlay-highlight')?.remove();
};
