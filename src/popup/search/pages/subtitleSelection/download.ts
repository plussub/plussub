import JSZip from 'jszip';
import {getFormatFromFilename} from "@/subtitle/util/getFormatFromFilename";
import {OpensubtitlesStateResponse} from "@/search/pages/subtitleSelection/searchRequest";
import {SubtitleFormat} from "@/subtitle/state/types";

export const download = async (opensubtitlesStateResponse: OpensubtitlesStateResponse): Promise<{ raw: string, format: SubtitleFormat }> => {
  if (!opensubtitlesStateResponse.ZipDownloadLink) {
    return Promise.reject('no link');
  }

  const { raw, format } = await fetch(opensubtitlesStateResponse.ZipDownloadLink)
    .then((r) => (r.headers.get('content-type')?.startsWith('application/zip') ? r : Promise.reject(`wrong content type: ${r.headers.get('content-type')}`)))
    .then((r) => r.arrayBuffer())
    .then((blob) => new JSZip().loadAsync(blob))
    .then((zip) => zip.file(/\.(srt|vtt|ssa|ass)$/)[0])
    .then(async (zipFile) => ({
      raw: (await zipFile.async('string')) ?? '',
      format: getFormatFromFilename(zipFile.name)
    }));

  if(!format){
    return Promise.reject(`${format} is not supported`);
  }

  return {
    raw,
    format
  };
};
