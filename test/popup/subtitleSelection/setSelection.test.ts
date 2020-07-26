import { setSelection } from '@/subtitleSelection/setSelection';
import { AppState, setAppState, snapshot } from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import opensubtitles from '../../shared/appstate/opensubtitlesState.json';
import tmdb from '../../shared/appstate/tmbdState.json';
import otherTmdb from '../../shared/appstate/tmbdState.json';

jest.mock('@/../shared/appState', () => ({
  __esModule: true,
  snapshot: jest.fn(),
  setAppState: jest.fn()
}));

describe('set selection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('without previous result', () => {
    const currentState: AppState = {
      ...getInitialState(),
      search: {
        tmdb: null,
        opensubtitles: null,
        inSelectionTmdb: tmdb
      }
    };
    (snapshot as jest.Mock).mockReturnValue(currentState);

    setSelection({
      LanguageName: 'givenLanguageName',
      SubDownloadLink: 'givenSubDownloadLink',
      SubFileName: 'givenSubFileName',
      SubFormat: 'givenSubFormat',
      SubRating: 'givenSubRating',
      SubtitlesLink: 'givenSubtitlesLink',
      ZipDownloadLink: 'givenZipDownloadLink'
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

  it('with previous result', () => {
    const currentState: AppState = {
      ...getInitialState(),
      state: 'DONE',
      src: 'FILE',
      search: {
        tmdb: otherTmdb,
        opensubtitles: opensubtitles,
        inSelectionTmdb: tmdb
      }
    };
    (snapshot as jest.Mock).mockReturnValue(currentState);

    setSelection({
      LanguageName: 'givenLanguageName',
      SubDownloadLink: 'givenSubDownloadLink',
      SubFileName: 'givenSubFileName',
      SubFormat: 'givenSubFormat',
      SubRating: 'givenSubRating',
      SubtitlesLink: 'givenSubtitlesLink',
      ZipDownloadLink: 'givenZipDownloadLink'
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
