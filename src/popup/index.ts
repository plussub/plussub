import { createApp } from 'vue';
import appComponent from './App.vue';
import "@/components/FontAwesomeIcon/fontAwesome";
import { EXTENSION_ORIGIN } from '@/types';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {
  extensionPopUpBoxShadowAsCssVar, extensionPopUpLeftAsCssVar, extensionPopUpTopAsCssVar,
  getExtensionPopUpDiv, getExtensionPopUpId,
  toDefaultExtensionPopUpBoxShadow, toExtensionPopUpInitTop
} from '@/extensionPopUpShadowDiv';


export const init = async (): Promise<void> => {
  if (getExtensionPopUpDiv()) {
    toExtensionPopUpInitTop();
    toDefaultExtensionPopUpBoxShadow();
  } else {
    const app = createApp(appComponent, {unmount: () => app.unmount()});
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia);
    toExtensionPopUpInitTop();
    toDefaultExtensionPopUpBoxShadow();

    const appShadowDiv = document.createElement('div');
    appShadowDiv.id = getExtensionPopUpId();
    Object.assign(appShadowDiv.style, {
      position: "absolute",
      zIndex: "10000",
      top: extensionPopUpTopAsCssVar(),
      left: extensionPopUpLeftAsCssVar(),
      right: "16px",
      width: "400px",
      boxShadow: extensionPopUpBoxShadowAsCssVar()
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
