import JSZip from 'jszip';
import { setState } from '@/app/state';
import { parse, setRaw } from '@/subtitle/state';
import {getFormatFromFilename} from "@/subtitle/util/getFormatFromFilename";

export const triggerDownload = async (): Promise<void> => {
  const { openSubtitle } = window.plusSub_subtitleSearch.value;
  const link = openSubtitle?.ZipDownloadLink;
  const subHash = openSubtitle?.SubHash

  if (!link || !subHash) {
    console.warn('no link or subhash');
    return;
  }
  setState({ state: 'DOWNLOADING' });
  const { raw, format } = await fetch(link)
    .then((r) => (r.headers.get('content-type')?.startsWith('application/zip') ? r : Promise.reject(`wrong content type: ${r.headers.get('content-type')}`)))
    .then((r) => r.arrayBuffer())
    .then((blob) => new JSZip().loadAsync(blob))
    .then((zip) => zip.file(/\.(srt|vtt|ssa|ass)$/)[0])
    .then(async (zipFile) => ({
      raw: (await zipFile.async('string')) ?? '',
      format: getFormatFromFilename(zipFile.name)
    }))
    .catch((e) => {
      setState({ state: 'ERROR' });
      return Promise.reject(e);
    });

  setRaw({ raw, format, id: subHash });
  parse();
};
