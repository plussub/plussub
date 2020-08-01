import { setAppState, setAppStatePartial, snapshot } from '../../shared/appState';
import { parse } from '#/parse';
import JSZip from 'jszip';

export const triggerDownload = async (): Promise<void> => {
  const { search } = snapshot();
  const link = search?.opensubtitles?.ZipDownloadLink;
  const fileName = search?.opensubtitles?.SubFileName;
  if (!link || !fileName) {
    return;
  }
  setAppStatePartial({ state: 'DOWNLOADING' });
  const raw = await fetch(link)
    .then((r) => r.blob())
    .then((blob) => new JSZip().loadAsync(blob))
    .then((zip) => zip.file(fileName))
    .then((zipFile) => zipFile?.async('string') ?? '');

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
  parse()
};
