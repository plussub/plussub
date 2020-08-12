import { setSelection } from '@/subtitleSelection/setSelection';
import {AppState, setAppStatePartial, snapshot} from '@/appState';
import { getInitialState } from '@/appState/getInitialState';
import opensubtitles from '../appState/opensubtitlesState.json';
import tmdb from '../appState/tmbdState.json';
import otherTmdb from '../appState/tmbdState.json';

jest.mock('@/appState', () => ({
  __esModule: true,
  setAppStatePartial: jest.fn(),
  snapshot: jest.fn()
}));

describe('set selection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('without previous result', async () => {
    const appState: AppState = {
      ...getInitialState(),
      search: {
        tmdb: null,
        opensubtitles: null,
        inSelectionTmdb: tmdb
      }
    };
    (snapshot as jest.Mock).mockResolvedValue(appState);
    await setSelection({
      item: {
        LanguageName: 'givenLanguageName',
        SubDownloadLink: 'givenSubDownloadLink',
        SubFileName: 'givenSubFileName',
        SubFormat: 'givenSubFormat',
        SubRating: 'givenSubRating',
        SubtitlesLink: 'givenSubtitlesLink',
        ZipDownloadLink: 'givenZipDownloadLink'
      }
    });

    expect(setAppStatePartial).toHaveBeenCalledWith({
      src: 'SEARCH',
      state: 'SELECTED',
      search: {
        tmdb: tmdb,
        opensubtitles: {
          LanguageName: 'givenLanguageName',
          SubDownloadLink: 'givenSubDownloadLink',
          SubFileName: 'givenSubFileName',
          SubFormat: 'givenSubFormat',
          SubRating: 'givenSubRating',
          SubtitlesLink: 'givenSubtitlesLink',
          ZipDownloadLink: 'givenZipDownloadLink'
        },
        inSelectionTmdb: null
      }
    });
  });

  it('with previous result', async () => {
    const appState: AppState = {
      ...getInitialState(),
      state: 'DONE',
      src: 'FILE',
      search: {
        tmdb: otherTmdb,
        opensubtitles: opensubtitles,
        inSelectionTmdb: tmdb
      }
    };
    (snapshot as jest.Mock).mockResolvedValue(appState);

    await setSelection({
      item: {
        LanguageName: 'givenLanguageName',
        SubDownloadLink: 'givenSubDownloadLink',
        SubFileName: 'givenSubFileName',
        SubFormat: 'givenSubFormat',
        SubRating: 'givenSubRating',
        SubtitlesLink: 'givenSubtitlesLink',
        ZipDownloadLink: 'givenZipDownloadLink'
      }
    });

    expect(setAppStatePartial).toHaveBeenCalledWith({
      src: 'SEARCH',
      state: 'SELECTED',
      search: {
        tmdb: tmdb,
        opensubtitles: {
          LanguageName: 'givenLanguageName',
          SubDownloadLink: 'givenSubDownloadLink',
          SubFileName: 'givenSubFileName',
          SubFormat: 'givenSubFormat',
          SubRating: 'givenSubRating',
          SubtitlesLink: 'givenSubtitlesLink',
          ZipDownloadLink: 'givenZipDownloadLink'
        },
        inSelectionTmdb: null
      }
    });
  });
});
