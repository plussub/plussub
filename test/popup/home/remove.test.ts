import { remove } from '@/home/remove';
import { AppState, setAppState } from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import opensubtitles from '../../shared/appstate/opensubtitlesState.json';
import filePick from '../../shared/appstate/filePickState.json';
import srt from '../../shared/appstate/srtState.json';
import tmdb from '../../shared/appstate/tmbdState.json';

jest.mock('@/../shared/appState', () => ({
  __esModule: true,
  setAppState: jest.fn()
}));

describe('set selection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('without previous result', () => {
    const appState: AppState = {
      ...getInitialState(),
      state: 'DONE',
      src: 'FILE',
      search: {
        tmdb,
        opensubtitles,
        inSelectionTmdb: null
      },
      filePick,
      srt,
      offsetTime: 12
    };

    remove({appState});

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
      state: 'NONE',
      src: 'NONE',
      offsetTime: 12,
      search: null,
      filePick: null,
      srt: {
        raw: null,
        parsed: [],
        withOffsetParsed: []
      }
    });
  });
});
