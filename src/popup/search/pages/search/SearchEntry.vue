<template>
  <div class="search-content--container--card" @click="select(item)">
    <div style="grid-area: poster">
      <img
        :src="item.poster_path ?? posterFallback"
        style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover; border-top-left-radius: var(--card-border-radius); border-top-right-radius: var(--card-border-radius)"
      />
    </div>
    <div style="grid-area: title">
      <div style="font-weight: 500; font-size: 1.25em; color: var(--default-header-text-color);">
        {{ item.title }}
      </div>
      <div style="font-size: 0.75em; margin-top: 8px; font-weight: 500;">{{ prettyMediaType }} {{ item.release_date ? "/ "+item.release_date.substr(0, 4) : ''}}</div>
      <div style="font-size: 0.75em; margin-top: 4px;">tmdb {{ item.vote_average }}</div>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { computed } from '@vue/reactivity';
import { TmdbState } from '@/search/state/types';
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
  display: grid;
  grid-template-areas:
    '. .      . .     .'
    '. poster . .     .'
    '. poster . title .'
    '. .      . .     .';
  grid-template-rows: 4px 8px 90px 4px;
  grid-template-columns: 4px 60px 16px 1fr var(--card-lr-space);
  width: 100%;
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

.search-content--container--card:hover {
  background-color: var(--hoverColorOnSurfce);
  cursor: pointer;
}
</style>
