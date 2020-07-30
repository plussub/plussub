import { setSelection } from '@/filepick/setSelection';
import {AppState, setAppState} from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';

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
      offsetTime: 12
    };

    setSelection({filename: 'given filename', rawSrt: 'given srt', appState});

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
      src: 'FILE',
      state: 'SELECTED',
      filePick: {
        filename: 'given filename'
      },
      srt: {
        raw: 'given srt',
        parsed: [],
        withOffsetParsed: []
      },
      offsetTime: 12
    });
  });
});
