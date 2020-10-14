import { createApp } from 'vue';
import IFrameApp from './IFrameApp.vue';

export const init = async (): Promise<void> => {
  const videoEl = document.querySelector('video');
  if (!videoEl || document.getElementById('plussubShadow')) {
    return;
  }
  const frameSrc = window.frameElement?.getAttribute('src') ?? window.location.href;
  const appShadowDiv = document.createElement('div');
  const shadow = appShadowDiv.attachShadow({ mode: 'open' });
  appShadowDiv.id = 'plussubShadow';
  const appDiv = document.createElement('div');
  appDiv.id = 'plussub';
  shadow.appendChild(appDiv);
  const app = createApp(IFrameApp, {
    frameSrc,
    videoEl
  });
  app.mount(appDiv);
};;
