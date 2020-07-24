import { reactive, watch } from 'vue';
import { snapshot } from '../shared/appState';
(async () => {
  const appState = reactive(snapshot());
  // const state = reactive({ someval: 'a' });
  //
  watch(
    () => appState.offsetTime,
    (change) => console.warn(change),
    {
      deep: true
    }
  );
  // console.warn('wtf');
  // console.warn(appState);
  setInterval(() => {
    // ++appState.offsetTime.time;
  }, 1000);
})();
