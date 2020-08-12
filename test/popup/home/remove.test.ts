import { remove } from '@/home/remove';
import { AppState, setAppStatePartial, snapshot } from '@/appState';
import { getInitialState } from '@/appState/getInitialState';

jest.mock('@/appState', () => ({
  __esModule: true,
  setAppStatePartial: jest.fn(),
  snapshot: jest.fn()
}));

describe('remove', () => {
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
