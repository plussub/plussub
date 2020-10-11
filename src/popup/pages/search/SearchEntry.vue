<template>
  <div class="search-content--container--card">
    <div style="grid-area: header; position: relative">
      <div class="search-content--container--card--hero">
        <img
          :src="item.poster_path ?? posterFallback"
          style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover; border-top-left-radius: var(--card-border-radius); border-top-right-radius: var(--card-border-radius)"
        />
      </div>
      <div style="position: absolute; color: white; top: 8px; left: 16px; width: calc(100% - 32px)">
        <div style="font-family: var(--card-header-font-family); width: 100%; display: flex; justify-content: space-between">
          <span>
            <div style="font-size: var(--card-header-font-size); font-weight: 400">
              {{ item.title }}
            </div>
            <div style="font-size: 0.75em">({{ prettyMediaType }} {{ item.release_date }})</div>
          </span>
        </div>
      </div>
      <div style="font-size: 0.75em; position: absolute; bottom: 12px; right: 16px; color: white; font-weight: 500">
        <div>tmdb {{ item.vote_average }}</div>
      </div>
    </div>
    <div style="grid-area: content; width: 100%; font-size: 1em; line-height: 1.8; font-weight: 300">
      {{ item.overview }}
    </div>
    <div style="grid-area: action">
      <a class="knopf flat block end large" style="width: 100%" @click="select(item)">Select</a>
    </div>
    <div
      style="
        grid-column: 1/4;
        grid-row: 5/8;
        background-color: var(--card-actions-background-color);
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      "
    />
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { computed } from '@vue/reactivity';
import { TmdbState } from '@/appState';
import { capitalizeFirst } from '@/util/string';

export { default as posterFallback } from '@/res/posterFallback.png';

declare const props: {
  item: TmdbState;
};

export default {
  emits: ['select']
};

export const select = (selected) => emit('select', selected);
export const prettyMediaType = computed(() => capitalizeFirst(props.item.media_type));
</script>
<style scoped>
/* plussub header */
.search-content--container--card {
  --image-height: 120px;
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-border-radius);
  display: grid;
  grid-template-areas:
    'header header  header'
    '.      .       .'
    '.      content .'
    '.      .       .'
    '.      .       .'
    '.      action  .'
    '.      .       .';
  grid-template-rows: var(--image-height) 16px 1fr 16px 8px 50px 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  margin-bottom: 8px;
}

.search-content--container--card--hero::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.62);
  opacity: 1;
  border-top-left-radius: var(--card-border-radius);
  border-top-right-radius: var(--card-border-radius);
}
</style>
