// import { addVttTo, removeVttFrom } from '@/pages/home/vttInject';
import { createApp } from 'vue';
import IFrameApp from './IFrameApp.vue';

export const init = async (): Promise<void> => {
  const videoEl = document.querySelector('video');
  if (videoEl && !document.getElementById('plussubShadow')) {
    const frameSrc = window.frameElement?.getAttribute('src') ?? window.location.href;
    const appShadowDiv = document.createElement('div');
    const shadow = appShadowDiv.attachShadow({ mode: 'open' });
    appShadowDiv.id = 'plussubShadow';
    const appDiv = document.createElement('div');
    appDiv.id = 'plussub';
    shadow.appendChild(appDiv);

    const app = createApp(IFrameApp, {
        frameSrc,
        videoEl,
        test: 'xxxxx'
    });
    app.mount(appDiv);
    // // here we notifiy the parent container that we found an iframe
    // window.top.postMessage({
    //   plusSubAction: 'sendiFrameSrc',
    //   src: frameSrc,
    //   hasSubtitle: videoEl.classList.contains('plussub')
    // }, '*');
    // const handleTimeUpdate = () => {
    //   window.top.postMessage({plusSubAction: 'currentTime', data: videoEl.currentTime}, '*');
    // };
    // window.addEventListener('message', (e) => {
    //   const {plusSubAction, data} = e.data;
    //   switch (plusSubAction) {
    //     case 'addSubtitle':
    //       // addVttTo({el: videoEl, subtitle: JSON.parse(data)});
    //       break;
    //     case 'removeSubtitle':
    //       // removeVttFrom({el: videoEl});
    //       break;
    //     case 'startTranscript':
    //       videoEl.addEventListener('timeupdate', handleTimeUpdate);
    //       break;
    //     case 'stopTranscript':
    //       window.removeEventListener('message', handleTimeUpdate);
    //       break;
    //     case 'setCurrentTime':
    //       videoEl.currentTime = data / 1000;
    //   }
    // });
  }
};
