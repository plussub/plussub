<template>
  <div class="result-from-search--card" style="position: relative;">
    <div style="grid-row: 1/2; grid-column: 2/3; z-index: 10;" class="result-from-search--card--hero--text">
      <div style="position: absolute; top: 8px; right: 16px; display: flex; font-weight: 500;">
        <div style="font-size: 0.65em; margin-right: 16px;">{{ prettyState }}</div>
        <div style="font-size: 0.65em;">
          <transition name="fade" mode="out-in">
            <spinner v-if="state !== 'DONE'"/>
            <i v-else class="fa fa-check fa-sm"></i>
          </transition>
        </div>
      </div>
      <div style="grid-area: title; font-size: var(--card-header-font-size); font-weight: 400">{{ searchState.tmdb.title }}</div>
      <div style="grid-area: subtitle; font-size: 0.75em; font-weight: 200">
        ({{ prettyMediaType }} {{ searchState.tmdb.release_date }})
      </div>
      <div
          style="grid-area: detail; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px; width: 100%; font-size: 0.75em; line-height: 1.6; font-weight: 400">
        <div style="grid-column: 1 / 2;">subRating</div>
        <div style="grid-column: 2 / 3;">{{ searchState.opensubtitles.SubRating }}</div>
        <div style="grid-column: 1 / 2;">subFormat</div>
        <div style="grid-column: 2 / 3;">{{ searchState.opensubtitles.SubFormat }}</div>
        <div style="grid-column: 1 / 2;">subLang</div>
        <div style="grid-column: 2 / 3;">{{ searchState.opensubtitles.LanguageName }}</div>
      </div>
      <div style="grid-area: detail2; font-size: 0.75em; align-self: end; font-weight: 500">
        <div>tmdb {{ searchState.tmdb.vote_average }}</div>
      </div>
    </div>
    <div style="grid-area: header; position: relative;">
      <div class="result-from-search--card--hero">
        <img :src="searchState.tmdb.poster_path"
             style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;"/>
      </div>
    </div>
    <div style="grid-area: overview; display: flex; width: 100%; font-size: 1em; line-height: 1.6;">
      <expandable style="width: 100%;">
        <template #title>
          <div style="font-weight: 600">
            Overview
          </div>
        </template>
        <template #content>
          <div style="font-weight: 300">
            {{ searchState.tmdb.overview }}
          </div>
        </template>
      </expandable>
    </div>
    <div style="grid-area: settings">
      <slot name="settings"/>
    </div>
    <div style="grid-area: settings-divider; display: flex; align-items: center;">
      <divider style="flex-grow: 1;"/>
    </div>
    <div style="grid-area: actions; justify-self: end; align-self: center;">
      <a class="knopf flat block end large" style="width: 100%;" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script>
import Divider from '@/components/Divider';
import Spinner from '@/components/Spinner';
import {computed} from '@vue/reactivity';
import Expandable from '@/components/Expandable';

export default {
  components: {
    Divider,
    Spinner,
    Expandable
  },
  props: {
    state: String,
    searchState: Object
  },
  setup(props) {
    return {
      prettyState: computed(() => `${props.state.charAt(0).toUpperCase()}${props.state.slice(1).toLowerCase()}`),
      prettyMediaType: computed(() => `${props.searchState.tmdb.media_type.charAt(0).toUpperCase()}${props.searchState.tmdb.media_type.slice(1).toLowerCase()}`)
    };
  }
};
</script>
<style scoped>/* plussub header */
.result-from-search--card {
  --image-height: 150px;
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  grid-template-areas:
    'header           header           header'
    '.                .                .'
    '.                overview         .'
    '.                .                .'
    '.                settings         .'
    'settings-divider settings-divider settings-divider'
    '.                actions          .';
  grid-template-rows: var(--image-height) 16px auto 16px auto 16px 50px;
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
    '. title    .            .'
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}
</style>
