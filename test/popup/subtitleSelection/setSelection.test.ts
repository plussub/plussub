import { setSelection } from '@/subtitleSelection/setSelection';
import {AppState, setAppState, snapshot} from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import opensubtitles from '../../shared/appstate/opensubtitlesState.json';
import tmdb from '../../shared/appstate/tmbdState.json';
import otherTmdb from '../../shared/appstate/tmbdState.json';

jest.mock('@/../shared/appState', () => ({
  __esModule: true,
  setAppState: jest.fn(),
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

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
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

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
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
