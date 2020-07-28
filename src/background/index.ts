import { setAppState, setAppStatePartial, snapshot } from '#/../shared/appState';
import { parse } from '#/parser';

declare global {
  interface Window {
    plussub: {
      parse: () => void;
    };
  }
}

window.plussub = {
  parse() {
    setAppStatePartial({ state: 'PARSING' });
    const parsed = parse(snapshot().srt.raw);
    // get a new snapshot because maybe has something change in the meantime
    const appState = snapshot();
    setAppState({
      ...appState,
      state: 'DONE',
      srt: {
        raw: appState.srt.raw,
        parsed
      }
    });
  }
};
