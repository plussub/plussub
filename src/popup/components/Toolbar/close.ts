import { useApp } from '@/index';

export const close = (): void => {
  const app = useApp();
  const appDiv = document.getElementById('plusSubShadow')?.shadowRoot?.getElementById('plussub');
  // unmount app otherwise watch will continue to work
  app.unmount();

  document.getElementById('plusSubShadow')?.remove();
};
