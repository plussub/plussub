import { setAppState, setAppStatePartial, snapshot } from '#/../shared/appState';
import { parse } from '@plussub/srt-vtt-parser';

declare global {
  interface Window {
    plussub: {
      parse: () => void;
    };
  }
}

window.plussub = {
  async parse() {
    setAppStatePartial({ state: 'PARSING' });
    const {srt: {raw}} = snapshot();
    if(!raw){
      return;
    }
    const parsed = parse(raw);
    // get a new snapshot because maybe has something change in the meantime
    const appState = snapshot();
    setAppState({
      ...appState,
      state: 'DONE',
      srt: {
        raw: appState.srt.raw,
        parsed: parsed.entries,
        withOffsetParsed: parsed.entries.map(e => ({...e, from: e.from + appState.offsetTime, to: e.to + appState.offsetTime}))
      }
    });
  }
};
