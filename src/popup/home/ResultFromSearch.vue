<template>
  <div class="result-from-search--card">
    <div style="grid-row: 1/2; grid-column: 2/3; z-index: 10;" class="result-from-search--card--hero--text">
      <div style="grid-area: title; font-size: var(--card-header-font-size);">{{ appState.search.tmdb.title }}</div>
      <div style="grid-area: spinner-text; font-size: 0.5em; place-self: center end; padding-right: 5px;">{{ currentState }}</div>
      <div style="grid-area: spinner; font-size: 0.5em; align-self: center; justify-self: center;"><spinner /></div>
      <div style="grid-area: subtitle; font-size: 0.75em;">({{ appState.search.tmdb.media_type }} {{ appState.search.tmdb.release_date }})</div>
      <div style="grid-area: detail; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px; width: 100%; font-size: 0.75em; line-height: 1.6;">
        <div style="grid-column: 1 / 2;">subRating:</div>
        <div style="grid-column: 2 / 3;">{{ appState.search.opensubtitles.SubRating }}</div>
        <div style="grid-column: 1 / 2;">subFormat:</div>
        <div style="grid-column: 2 / 3;">{{ appState.search.opensubtitles.SubFormat }}</div>
        <div style="grid-column: 1 / 2;">subLang:</div>
        <div style="grid-column: 2 / 3;">{{ appState.search.opensubtitles.LanguageName }}</div>
      </div>
      <div style="grid-area: detail2; font-size: 0.75em; align-self: end;">
        <div>tmdb: {{ appState.search.tmdb.vote_average }}</div>
      </div>
    </div>
    <div style="grid-area: card-header; position: relative;">
      <div class="result-from-search--card--hero">
        <img :src="appState.search.tmdb.poster_path" style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;" />
      </div>
    </div>
    <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
      {{ appState.search.tmdb.overview }}
    </div>
    <div style="grid-area: card-divider; align-self: end;">
      <divider />
    </div>
    <div style="grid-area: card-action; justify-self: end;">
      <a class="knopf flat block end small" style="width: 100%;" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script>
import Divider from '@/components/Divider';
import { snapshot } from '../../shared/appState';
import Spinner from '@/components/Spinner';
import { computed } from '@vue/reactivity';

export default {
  components: {
    Divider,
    Spinner
  },
  setup() {
    const appState = snapshot();
    return {
      appState,
      currentState: computed(() => `${appState.state.charAt(0).toUpperCase()}${appState.state.slice(1).toLowerCase()}`)
    };
  }
};
</script>
<style>
.result-from-search--card {
  --image-height: 150px;
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

.result-from-search--card--hero--text {
  font-family: var(--card-header-font-family);
  display: grid;
  width: 100%;
  height: 100%;
  color: white;
  grid-template-areas:
    '. .        .            .'
    '. title    spinner-text      spinner'
    '. subtitle .            .'
    '. .        .            .'
    '. detail   detail2      .'
    '. .        .            .';
  grid-template-rows: 8px auto auto 1fr auto 8px;
  grid-template-columns: var(--card-lr-space) 1fr auto var(--card-lr-space);
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
