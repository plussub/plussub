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
  const { raw, format} = await fetch(link)
    .then((r) => r.arrayBuffer())
    .then((blob) => new JSZip().loadAsync(blob))
    .then((zip) => zip.file(/\.(srt|vtt|ssa|ass)$/)[0])
    .then(async (zipFile) => ({
      raw: (await zipFile.async('string')) ?? '',
      format: getFormatFromFilename(zipFile.name)
    }));

  setRaw({ raw, format, id: subHash });
  parse();
};
