import { useApp } from '@/index';
import { EXTENSION_ORIGIN } from '@/types';

export const close = (): void => {
  const app = useApp();
  // unmount app otherwise watch will continue to work
  app.unmount();

  document.getElementById(`${EXTENSION_ORIGIN}Shadow`)?.remove();
};
