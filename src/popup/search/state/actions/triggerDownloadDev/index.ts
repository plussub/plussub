import { OpensubtitlesStateResponse } from '@/search/pages/subtitleSelection/searchRequestDev';
import { setState } from '@/app/state';
import { parse, setRaw } from '@/subtitle/state';

export const triggerDownloadDev = async (opensubtitlesStateResponse: OpensubtitlesStateResponse): Promise<void> => {
  setState({ state: 'DOWNLOADING' });

  const { file_name, link } = await fetch('https://api.opensubtitles.com/api/v1/download', {
    method: 'POST',
    body: JSON.stringify({ file_id: opensubtitlesStateResponse.attributes.files[0].file_id }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Api-Key': 'Th2A6DhpAl1kshBZlLqwwfZZd0i7p7Hn'
    }
  })
    .then((r) => r.json())
    .catch((e) => {
      setState({ state: 'ERROR' });
      return Promise.reject(e);
    });

  const raw = await fetch(link)
    .then((r) => r.text())
    .catch((e) => {
      setState({ state: 'ERROR' });
      return Promise.reject(e);
    });

  const format = file_name.substr(file_name.lastIndexOf('.'));

  setRaw({ raw, format, id: file_name });
  parse();
};
