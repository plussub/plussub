import { setAppStatePartial, snapshot } from '../../shared/appState';
import { parse } from '#/parse';
import JSZip from 'jszip';

export const triggerDownload = async (): Promise<void> => {
  const { search } = await snapshot();
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

  await setAppStatePartial({
    srt: {
      raw,
      parsed: [],
      withOffsetParsed: []
    }
  });
  await parse()
};
