import { setAppStatePartial, snapshot } from '@/appState';
import { parse } from '@/parse';
import JSZip from 'jszip';

export const triggerDownload = async (): Promise<void> => {
  const { search } = await snapshot();
  const link = search?.opensubtitles?.ZipDownloadLink;
  const fileName = search?.opensubtitles?.SubFileName;
  if (!link || !fileName) {
    return;
  }
  await setAppStatePartial({ state: 'DOWNLOADING' });
  // TODO: has bug on some file
  const raw = await fetch(link)
    .then((r) => r.arrayBuffer())
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
  await parse();
};
