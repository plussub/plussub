import {App, createApp} from 'vue';
// import IFrameApp from './IFrameApp.vue';

let app: App;

export const init = async (): Promise<void> => {
  if (document.getElementById('plussubShadow')){
    return;
  } else {
    // app = createApp(IFrameApp);
    // const appShadowDiv = document.createElement('div');
    // appShadowDiv.id = 'plussubShadow';
    // // appShadowDiv.style.cssText = `position:absolute;z-index: 10000; top: ${window.scrollY + 30}px; right: 16px; width: 400px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); font-size: 16px`;
    //
    // const appDiv = document.createElement('div');
    // appDiv.id = 'plussub';
    //
    // const shadow = appShadowDiv.attachShadow({ mode: 'open' });
    // shadow.appendChild(appDiv);
    // const plussubStyle = document.getElementById('plussub-style') as HTMLElement;
    // if(plussubStyle){
    //   shadow.prepend(plussubStyle);
    // }
    // document.body.prepend(appShadowDiv);
    // app.mount(appDiv);
  }
};


export const useIFrameApp = (): App => {
  return app;
};
