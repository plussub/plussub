import { createApp } from 'vue';
import IFrameApp from './IFrameApp.vue';

const getSrc = (window: Window) => {
  if (window.frameElement) {
    return window.frameElement.getAttribute('src');
  } else {
    return window.location.href;
  }
};

export const init = async (): Promise<void> => {
  const videoEl = document.querySelector('video');
  if (!videoEl || document.getElementById('plussubShadow')) {
    return;
  }
  // const frameSrc = window.frameElement?.getAttribute('src') ?? window.location.href;
  let frameSrc;
  if (window.parent !== window.top) {
    // when iFrame is nested
    frameSrc = getSrc(window.parent);
  } else {
    frameSrc = getSrc(window);
  }
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
};
