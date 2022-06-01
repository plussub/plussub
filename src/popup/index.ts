import { createApp, App } from 'vue';
import appComponent from './App.vue';
import "@/components/FontAwesomeIcon/fontAwesome";
import { EXTENSION_ORIGIN } from '@/types';
let app: App;

export const init = async (): Promise<void> => {
  if (document.getElementById(`${EXTENSION_ORIGIN}Shadow`)) {
    document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, `${window.scrollY + 30}px`)
  } else {
    app = createApp(appComponent);
    document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, `${window.scrollY + 30}px`);

    const appShadowDiv = document.createElement('div');
    appShadowDiv.id = `${EXTENSION_ORIGIN}Shadow`;
    appShadowDiv.style.position = "absolute";
    appShadowDiv.style.zIndex = "10000";
    appShadowDiv.style.top = `var(--${EXTENSION_ORIGIN}-shadow-top)`;
    appShadowDiv.style.right = "16px";
    appShadowDiv.style.width = "400px";
    appShadowDiv.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
    const shadow = appShadowDiv.attachShadow({ mode: 'open' });

    const appDiv = document.createElement('div');
    appDiv.id = EXTENSION_ORIGIN;
    shadow.appendChild(appDiv);

    shadow.prepend(document.getElementById(`${EXTENSION_ORIGIN}-style`) as HTMLElement);
    document.body.prepend(appShadowDiv);
    app.mount(appDiv);
  }
};

export const useApp = (): App => {
  return app;
};

init();
