import { defineStore } from 'pinia';
import { windowStorage } from '@/windowStorage';
import { computed, ref } from 'vue';

export interface TmdbState {
  tmdb_id: string;
  poster_path: string | null;
  title: string;
  media_type: string;
  release_date: string;
  vote_average: number;
}

export interface OpensubtitlesState {
  websiteLink: string;
  rating: string;
  format: string;
  languageName: string;
}

export const useStore = defineStore('search', () => {

    const inSelectionTmdb = ref<TmdbState | null>(null);
    const tmdb = ref<TmdbState | null>(null);
    const openSubtitle = ref<OpensubtitlesState | null>(null);
    return {
      inSelectionTmdb,
      tmdb,
      openSubtitle,
      selectOpenSubtitle(payload: OpensubtitlesState) {
        tmdb.value = inSelectionTmdb.value;
        inSelectionTmdb.value = null;
        openSubtitle.value = payload;
      },
      setTmdbInSelection(payload: TmdbState) {
        inSelectionTmdb.value = payload;
        tmdb.value = null;
        openSubtitle.value = null;
      },
      reset(){
        tmdb.value = null
        inSelectionTmdb.value = null;
        openSubtitle.value = null;
      },
      releaseYear: computed(() => tmdb.value?.release_date.substring(0, 4) ?? null),
      tmdbLink: computed(() => `https://www.themoviedb.org/${tmdb.value?.media_type}/${tmdb.value?.tmdb_id}`)
    };
  },
  {
    persist: {
      key: 'search',
      storage: windowStorage
    }
  });