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

export const snapshot = async (): Promise<AppState> => load();

export const setAppState = async (state: AppState): Promise<AppState> => {
  localStorage.setItem('appState', JSON.stringify(state));
  return state;
};
export const setAppStatePartial = async (state: Partial<AppState>): Promise<AppState> => {
  const newState = {...(await snapshot()), ...state};
  console.warn(newState);
  localStorage.setItem('appState', JSON.stringify(newState));
  return newState;
};
