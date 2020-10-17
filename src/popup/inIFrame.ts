import { createApp } from 'vue';
import { isValidVideo, initMutationObserver } from '@/video/state';
import IFrameApp from './IFrameApp.vue';

const getIframeSrc = (window: Window) => {
  return window.frameElement ? window.frameElement.getAttribute('src') : window.location.href;
};

export const init = async (): Promise<void> => {
  // To get the top iframe if video is in nested iframe
  // const frameSrc = getIframeSrc(window.parent !== window.top ? window.parent : window);
  const frameSrc = getIframeSrc(window.parent !== window.top ? window.parent : window) ?? '';
  // initMutationObserver('I_FRAME', frameSrc);
  const videoEl = document.querySelector('video');
  if (!videoEl || !isValidVideo(videoEl, frameSrc, 'I_FRAME') || document.getElementById('plussubShadow')) {
    return;
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
