import { reactive, watch } from 'vue';
import {loadAppState} from '#/appState';
(async () => {
  const appState = await loadAppState();
  console.warn(appState);
  // const state = reactive({ someval: 'a' });
  //
  // watch(() => state.someval,
  //   (change) => console.warn(change) );
  //
  // setInterval(() => {
  //   state.someval += 'x';
  // }, 1000)

  console.log('wt2f')
})();
