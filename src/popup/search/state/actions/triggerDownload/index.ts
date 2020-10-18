import JSZip from 'jszip';
import { setState } from '@/app/state';
import { parse, setRaw } from '@/subtitle/state';

export const triggerDownload = async (): Promise<void> => {
  const { openSubtitle } = window.plusSub_subtitleSearch.value;
  const link = openSubtitle?.ZipDownloadLink;
  const fileName = openSubtitle?.SubFileName;
  if (!link || !fileName) {
    return;
  }
  setState({ state: 'DOWNLOADING' });
  const raw = await fetch(link)
    .then((r) => r.arrayBuffer())
    .then((blob) => new JSZip().loadAsync(blob))
    // change this because sometimes the SubFileName
    // is different from the real file name in the zip
    .then((zip) => zip.file(/\.(srt|vtt)$/)[0])
    .then((zipFile) => zipFile?.async('string') ?? '');

  setRaw({ raw });
  parse();
};
