import { createApp, App } from 'vue';
import appComponent from './App.vue';
import FontAwesomeIcon from "@/components/FontAwesomeIcon/fontAwesome";

let app: App;

export const init = async (): Promise<void> => {
  if (document.getElementById('plussubShadow')) {
    const appShadowDiv = <HTMLElement>document.getElementById('plussubShadow');
    appShadowDiv.style.top = `${(window.scrollY + 30).toString()}px`;
  } else {
    app = createApp(appComponent).component('fa', FontAwesomeIcon);
    const appShadowDiv = document.createElement('div');
    appShadowDiv.id = 'plussubShadow';
    appShadowDiv.style.cssText = `position:absolute;z-index: 10000; top: ${window.scrollY + 30}px; right: 16px; width: 400px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);`;
    const shadow = appShadowDiv.attachShadow({ mode: 'open' });
    const overlayHightlight = document.createElement('div');
    overlayHightlight.id = 'plussub-overlay-highlight';

    const appDiv = document.createElement('div');
    appDiv.id = 'plussub';
    shadow.appendChild(appDiv);

    shadow.prepend(document.getElementById('plussub-style') as HTMLElement);
    document.body.prepend(overlayHightlight);
    document.body.prepend(appShadowDiv);
    app.mount(appDiv);
  }
};

export const useApp = (): App => {
  return app;
};
