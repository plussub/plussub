import JSZip from "jszip";
import {setState} from "@/app/state";
import {parse, setRaw} from "@/subtitle/state";

export const triggerDownload = async (): Promise<void> => {
  const { openSubtitle } = window.plusSub_subtitleSearch.value;
  const link = openSubtitle?.ZipDownloadLink;
  const fileName = openSubtitle?.SubFileName;
  if (!link || !fileName) {
    return;
  }
  setState({ state: 'DOWNLOADING' });
  // TODO: has bug on some file
  const raw = await fetch(link)
    .then((r) => r.arrayBuffer())
    .then((blob) => new JSZip().loadAsync(blob))
    .then((zip) => zip.file(fileName))
    .then((zipFile) => zipFile?.async('string') ?? '');

  setRaw({raw});
  parse();
};
