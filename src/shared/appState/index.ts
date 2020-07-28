import { getInitialState } from './getInitialState';
import logger from '../logger';
import { AppState } from './types';

export * from './types';

const log = logger.extend('appstate');

const forceWrite = false;
const load = (): AppState => {
  const loadedState = localStorage.getItem('appState');
  const initialState = getInitialState();
  if (!loadedState || forceWrite) {
    log('No state found, create new appState');
    localStorage.setItem('appState', JSON.stringify(initialState));
    return initialState;
  }
  const parsedLoadedState: AppState = JSON.parse(loadedState);

  if (initialState.version !== parsedLoadedState.version) {
    log('Version mismatch, create new appState');
    localStorage.setItem('appState', JSON.stringify(initialState));
    return initialState;
  }
  log('Load state: %J', parsedLoadedState);
  return parsedLoadedState;
};

export const snapshot = (): AppState => load();

export const setAppState = (state: AppState): AppState => {
  localStorage.setItem('appState', JSON.stringify(state));
  return state;
};
export const setAppStatePartial = (state: Partial<AppState>): AppState => {
  const newState = {...snapshot(), ...state};
  localStorage.setItem('appState', JSON.stringify(newState));
  return newState;
};

// watch(
//   () => appState,
//   (change) => console.warn('persist'),
//   {
//     deep: true
//   }
// );
