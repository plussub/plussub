import { snapshot } from '+/../shared/appState';

(async () => {
  const appState = await snapshot();
  console.warn(appState);
})();
