import { AppState, setAppStatePartial, snapshot } from '@/appState';
import { getInitialState } from '@/appState/getInitialState';
import {setOffsetTime} from "@/home/setOffsetTime";
import srt from '../appState/srtState.json';

jest.mock('@/appState', () => ({
  __esModule: true,
  setAppStatePartial: jest.fn(),
  snapshot: jest.fn()
}));

describe('set offset time', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('without parsed result', async () => {
    const appState: AppState = getInitialState();
    (snapshot as jest.Mock).mockResolvedValue(appState);

    await setOffsetTime({offsetTime: 666});

    expect(setAppStatePartial).toHaveBeenCalledWith({
      offsetTime: 666,
      srt: {
        parsed: [],
        raw: null,
        withOffsetParsed: []
      }
    });
  });

  it('with parsed result', async () => {
    const appState: AppState = {
      ...getInitialState(),
      srt
    };
    (snapshot as jest.Mock).mockResolvedValue(appState);

    await setOffsetTime({offsetTime: 666});

    expect(setAppStatePartial).toHaveBeenCalledWith({
      offsetTime: 666,
      srt: {
        parsed: [{
          from: 12,
          to: 25,
          text: "given subtitle"
        }],
        raw: "<given srt>",
        withOffsetParsed: [{
          from: 678,
          to: 691,
          text: "given subtitle"
        }]
      }
    });
  });
});
