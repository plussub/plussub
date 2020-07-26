import { setSelection } from '@/search/setSelection';
import { AppState, setAppState, snapshot } from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import opensubtitles from '../../shared/appstate/opensubtitlesState.json';
import tmdb from '../../shared/appstate/tmbdState.json';

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
    (snapshot as jest.Mock).mockReturnValue(getInitialState());

    setSelection({
      tmdb_id: 'given_tmdb_id',
      media_type: 'given_media_type',
      description: 'given_description',
      overview: 'given_overview',
      poster_path: 'given_poster_path',
      release_date: 'given_realease_date',
      title: 'given_title',
      vote_average: 9
    });

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
      search: {
        tmdb: null,
        opensubtitles: null,
        inSelectionTmdb: {
          tmdb_id: 'given_tmdb_id',
          media_type: 'given_media_type',
          description: 'given_description',
          overview: 'given_overview',
          poster_path: 'given_poster_path',
          release_date: 'given_realease_date',
          title: 'given_title',
          vote_average: 9
        }
      }
    });
  });

  it('with previous result', () => {
    const currentState: AppState = {
      ...getInitialState(),
      search: {
        tmdb,
        opensubtitles,
        inSelectionTmdb: {
          tmdb_id: 'given_tmdb_id',
          media_type: 'given_media_type',
          description: 'given_description',
          overview: 'given_overview',
          poster_path: 'given_poster_path',
          release_date: 'given_realease_date',
          title: 'given_title',
          vote_average: 9
        }
      }
    };
    (snapshot as jest.Mock).mockReturnValue(currentState);
    setSelection({
      tmdb_id: 'tmdb_id',
      media_type: 'media_type',
      description: 'description',
      overview: 'overview',
      poster_path: 'poster_path',
      release_date: 'realease_date',
      title: 'title',
      vote_average: 0
    });

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
      search: {
        tmdb,
        opensubtitles,
        inSelectionTmdb: {
          tmdb_id: 'tmdb_id',
          media_type: 'media_type',
          description: 'description',
          overview: 'overview',
          poster_path: 'poster_path',
          release_date: 'realease_date',
          title: 'title',
          vote_average: 0
        }
      }
    });
  });
});
