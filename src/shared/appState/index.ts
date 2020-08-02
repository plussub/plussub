import { getInitialState } from './getInitialState';
import logger from '../logger';
import { AppState } from './types';
import {get, set, clear} from 'storage';

export * from './types';

const log = logger.extend('appstate');

const forceWrite = false;
const load = async (): Promise<AppState> => {
  const loadedState = await get<AppState>();
  const initialState = getInitialState();
  if (!loadedState || forceWrite) {
    log('No state found, create new appState');
    await set(initialState);
    return initialState;
  }

  if (initialState.version !== loadedState.version) {
    log('Version mismatch, create new appState');
    await set(initialState);
    return initialState;
  }
  log('Load state: %J', loadedState);
  return loadedState;
};

export const snapshot = async (): Promise<AppState> => load();

export const setAppState = async (state: AppState): Promise<AppState> => {
  await set(state);
  return state;
};
export const setAppStatePartial = async (state: Partial<AppState>): Promise<AppState> => {
  await set(state);
  return get() as Promise<AppState>;
};

export const resetAppState = async ():Promise<AppState> => {
  await clear();
  const initialState = getInitialState();
  await set(initialState);
  return initialState;
}
