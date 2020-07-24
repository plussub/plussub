<template>
  <div class="result-from-search--card">
    <div style="grid-area: card-header; position: relative;">
      <div class="result-from-search--card--hero">
        <img :src="appState.search.tmdb.poster_path" style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;" />
      </div>
      <div style="position: absolute; color: white; top: 8px; left: 16px; width: calc(100% - 32px);">
        <div style="font-family: var(--card-header-font-family); width: 100%; display: flex; justify-content: space-between;">
          <span>
            <span style="font-size: var(--card-header-font-size);">
              {{ appState.search.tmdb.title }}
            </span>
            <span style="font-size: 0.75em;"> ({{ appState.search.tmdb.release_date }}) </span>
          </span>
          <span style="align-self: flex-end;">
            <i class="fa fa-spinner"></i>
          </span>
        </div>
        <div style="font-size: 0.75em; margin-top: 16px; line-height: 1.6;">
          <div>tmdb: {{ appState.search.tmdb.vote_average }}</div>
          <div>subRating: {{ appState.search.opensubtitles.SubRating }}</div>
          <div>subLang: {{ appState.search.opensubtitles.LanguageName }}</div>
        </div>
      </div>
    </div>
    <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
      {{ appState.search.tmdb.overview }}
    </div>
    <div style="grid-area: card-divider; align-self: end;">
      <divider />
    </div>
    <div style="grid-area: card-action; justify-self: end;">
      <a class="knopf flat block end small" style="width: 100%;">More Info</a>
      <a class="knopf flat block end small" style="width: 100%;" @click="removeSubtitle">Remove subtitle</a>
      <a class="knopf flat block end small" style="width: 100%;">Select another subtitle</a>
    </div>
  </div>
</template>

<script>
import Divider from '@/components/Divider';
import { snapshot } from '../../shared/appState';

export default {
  components: {
    Divider
  },
  setup() {
    return {
      appState: snapshot()
    };
  }
};
</script>
<style>
.result-from-search--card {
  --image-height: 120px;
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  grid-template-areas:
    'card-header card-header card-header'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: var(--image-height) 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
.result-from-search--card--hero::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.62);
  opacity: 1;
}
</style>
