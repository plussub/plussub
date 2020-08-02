import { remove } from '@/home/remove';
import {AppState, setAppStatePartial, snapshot} from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import opensubtitles from '../../shared/appstate/opensubtitlesState.json';
import filePick from '../../shared/appstate/filePickState.json';
import srt from '../../shared/appstate/srtState.json';
import tmdb from '../../shared/appstate/tmbdState.json';

jest.mock('@/../shared/appState', () => ({
  __esModule: true,
  setAppStatePartial: jest.fn(),
  snapshot: jest.fn()
}));

describe('set selection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('without previous result', async () => {
    const appState: AppState = getInitialState();
    (snapshot as jest.Mock).mockResolvedValue(appState);

    await remove();

    expect(setAppStatePartial).toHaveBeenCalledWith({
      state: 'NONE',
      src: 'NONE',
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
