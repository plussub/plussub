import { setSelection } from '@/pages/search/setSelection';
import {AppState, setAppStatePartial, snapshot} from '@/appState';
import { getInitialState } from '@/appState/getInitialState';
import opensubtitles from '../../appState/opensubtitlesState.json';
import tmdb from '../../appState/tmbdState.json';

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
    (snapshot as jest.Mock).mockResolvedValue(getInitialState());

    await setSelection({
      item: {
        tmdb_id: 'given_tmdb_id',
        media_type: 'given_media_type',
        description: 'given_description',
        overview: 'given_overview',
        poster_path: 'given_poster_path',
        release_date: 'given_realease_date',
        title: 'given_title',
        vote_average: 9
      }
    });

    expect(setAppStatePartial).toHaveBeenCalledWith({
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

  it('with previous result', async () => {
    const appState: AppState = {
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
    (snapshot as jest.Mock).mockResolvedValue(appState);

    await setSelection({
      item: {
        tmdb_id: 'tmdb_id',
        media_type: 'media_type',
        description: 'description',
        overview: 'overview',
        poster_path: 'poster_path',
        release_date: 'realease_date',
        title: 'title',
        vote_average: 0
      }
    });

    expect(setAppStatePartial).toHaveBeenCalledWith({
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
