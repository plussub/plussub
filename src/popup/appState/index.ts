/**
 * appState
 * lifecycle: the state will be stored and survived page changes / reload and so on.
 */
import { getInitialState } from './getInitialState';
import { AppState } from './types';
import {get, set, clear} from 'storage';

export * from './types';

const forceWrite = false;
const load = async (): Promise<AppState> => {
  const loadedState = await get<AppState>();
  const initialState = getInitialState();
  if (!loadedState || forceWrite) {
    await set(initialState);
    return initialState;
  }

  if (initialState.version !== loadedState.version) {
    await set(initialState);
    return initialState;
  }
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
