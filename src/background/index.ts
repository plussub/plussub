import { AppState, setAppState, setAppStatePartial, snapshot } from '#/../shared/appState';
import { parse } from '@plussub/srt-vtt-parser';
import JSZip from 'jszip';

declare global {
  interface Window {
    plussub: {
      parse: () => void;
      setOffsetTime: ({ offsetTime }: { offsetTime: number }) => void;
      triggerDownload: () => Promise<void>;
    };
  }
}

window.plussub = {
  parse() {
    setAppStatePartial({ state: 'PARSING' });
    const {
      srt: { raw }
    } = snapshot();
    if (!raw) {
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
        withOffsetParsed: parsed.entries.map((e) => ({
          ...e,
          from: e.from + appState.offsetTime,
          to: e.to + appState.offsetTime
        }))
      }
    });
  },
  setOffsetTime({ offsetTime }) {
    const appState = snapshot();
    setAppState({
      ...appState,
      offsetTime,
      srt: {
        raw: appState.srt.raw,
        parsed: appState.srt.parsed,
        withOffsetParsed: appState.srt.parsed.map((e) => ({
          ...e,
          from: e.from + offsetTime,
          to: e.to + offsetTime
        }))
      }
    });
  },
  async triggerDownload(): Promise<void> {
    const {search} = snapshot();
    const link = search?.opensubtitles?.ZipDownloadLink;
    const fileName = search?.opensubtitles?.SubFileName;
    if (!link || !fileName) {
      return;
    }
    setAppStatePartial({ state: 'DOWNLOADING' });
    const raw = await fetch(link)
      .then((r) => r.blob())
      .then(blob => new JSZip().loadAsync(blob))
      .then(zip => zip.file(fileName))
      .then(zipFile => zipFile?.async('string') ?? '');

    // get a new snapshot because maybe has something change in the meantime
    const appState = snapshot();
    setAppState({
      ...appState,
      srt: {
        raw,
        parsed: [],
        withOffsetParsed: []
      }
    });
    window.plussub.parse();
  }
};
