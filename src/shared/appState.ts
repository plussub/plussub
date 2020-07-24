import { reactive, watch, toRefs, ToRefs } from 'vue';
import { version } from '../../package.json';
import logger from './logger';
const log = logger.extend('appstate');

interface TmdbState {
  id: string;
  poster_path: string;
  title: string;
  media_type: string;
  release_date: string;
  description: string;
  vote_average: number;
  overview: string;
}

interface OpensubtitlesState {
  SubFileName: string;
  SubDownloadLink: string;
  ZipDownloadLink: string;
  SubtitlesLink: string;
  SubRating: string;
  SubFormat: string;
  LanguageName: string;
}

interface SearchState {
  inSelectionTmdb: TmdbState | null;
  tmdb: TmdbState | null;
  opensubtitles: OpensubtitlesState | null;
}

interface OffsetTimeState {
  time: number;
  applied: boolean;
}

interface AppState {
  version: string;
  debug: boolean;
  state: 'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'DONE';
  src: 'NONE' | 'FILE' | 'SEARCH';
  search: SearchState| null;
  offsetTime: OffsetTimeState;
}

const getInitialState = (): AppState => ({
  debug: true,
  version,
  state: 'NONE',
  src: 'NONE',
  search: null,
  offsetTime: {
    time: 0,
    applied: true
  }
});

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

export const write = (state: AppState) => localStorage.setItem('appState', JSON.stringify(state));
export const writePartial = (state: Partial<AppState>) => localStorage.setItem('appState', JSON.stringify({ ...snapshot(), ...state }));

// watch(
//   () => appState,
//   (change) => console.warn('persist'),
//   {
//     deep: true
//   }
// );
