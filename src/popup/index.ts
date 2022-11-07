import { createApp } from 'vue';
import appComponent from './App.vue';
import "@/components/FontAwesomeIcon/fontAwesome";
import { EXTENSION_ORIGIN } from '@/types';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


export const init = async (): Promise<void> => {
  if (document.getElementById(`${EXTENSION_ORIGIN}Shadow`)) {
    document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, `${window.scrollY + 30}px`)
  } else {
    const app = createApp(appComponent, {unmount: () => app.unmount()});
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia);
    document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, `${window.scrollY + 30}px`);

    const appShadowDiv = document.createElement('div');
    appShadowDiv.id = `${EXTENSION_ORIGIN}Shadow`;
    Object.assign(appShadowDiv.style, {
      position: "absolute",
      zIndex: "10000",
      top: `var(--${EXTENSION_ORIGIN}-shadow-top)`,
      right: "16px",
      width: "400px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
    });

    const shadow = appShadowDiv.attachShadow({ mode: 'open' });

    const appDiv = document.createElement('div');
    appDiv.id = EXTENSION_ORIGIN;
    shadow.appendChild(appDiv);

    shadow.prepend(document.getElementById(`${EXTENSION_ORIGIN}-style`) as HTMLElement);
    document.body.prepend(appShadowDiv);
    app.mount(appDiv);
  }
};
init();
