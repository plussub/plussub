import { setSelection } from '@/filepick/setSelection';
import {AppState, setAppState, snapshot} from '@/../shared/appState';
import { getInitialState } from '@/../shared/appState/getInitialState';
import offsetTime from '../../shared/appstate/offsetTimeState.json';

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
      offsetTime
    };
    (snapshot as jest.Mock).mockReturnValue(currentState);

    setSelection({filename: 'given filename', rawSrt: 'given srt'});

    expect(setAppState).toHaveBeenCalledWith({
      ...getInitialState(),
      src: 'FILE',
      state: 'SELECTED',
      filePick: {
        filename: 'given filename'
      },
      srt: {
        raw: 'given srt',
        parsed: []
      },
      offsetTime: {
        applied: false,
        time: offsetTime.time
      }
    });
  });
});
