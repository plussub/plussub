import { Ref } from '@vue/reactivity';

export interface TmdbState {
  tmdb_id: string;
  poster_path: string | null;
  title: string;
  media_type: string;
  release_date: string;
  description: string;
  vote_average: number;
}

export interface OpensubtitlesState {
  websiteLink: string;
  rating: string;
  format: string;
  languageName: string;
}

export type SubtitleSearchState = Ref<{
  inSelectionTmdb: TmdbState | null;
  tmdb: TmdbState | null;
  openSubtitle: OpensubtitlesState | null;
  preferredLanguage: string;
}>;
