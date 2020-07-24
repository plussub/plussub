interface AppState {
  debug: boolean;
  offsetTime: {
    time: number;
    applied: Boolean;
  };
}

const initialState = (): AppState => ({
  debug: true,
  offsetTime: {
    time: 0,
    applied: true
  }
});

export const loadAppState = async (): Promise<AppState> => initialState();
