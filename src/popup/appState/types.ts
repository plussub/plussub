export interface TmdbState {
  tmdb_id: string;
  poster_path: string;
  title: string;
  media_type: string;
  release_date: string;
  description: string;
  vote_average: number;
  overview: string;
}

export interface OpensubtitlesState {
  SubFileName: string;
  SubDownloadLink: string;
  ZipDownloadLink: string;
  SubtitlesLink: string;
  SubRating: string;
  SubFormat: string;
  LanguageName: string;
}

export interface SearchState {
  inSelectionTmdb: TmdbState | null;
  tmdb: TmdbState | null;
  opensubtitles: OpensubtitlesState | null;
}

export interface FilePick {
  filename: string;
}

export interface SrtEntry {
  from: number;
  to: number;
  text: string;
}

export interface SrtState {
  raw: string | null;
  parsed: SrtEntry[];
  withOffsetParsed: SrtEntry[];
}

export interface VideoInIframe {
  src: string;
  hasSubtitle: boolean;
}

export interface AppState {
  version: string;
  debug: boolean;
  state: 'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'DONE';
  src: 'NONE' | 'FILE' | 'SEARCH';
  search: SearchState | null;
  filePick: FilePick | null;
  offsetTime: number;
  targetSrc: string | null;
  srt: SrtState;
}
