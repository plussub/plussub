<template>
  <div class="subtitle-selection-content--container--card" @click="select(item)">
    <div
      style="
        grid-area: header;
        font-size: 1.25em;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--default-header-text-color);
        font-weight: 500;
        font-family: 'Rubik', sans-serif;
        word-break: break-all;
      "
    >
      {{ item.SubFileName }}
    </div>
    <div style="grid-area: content; display: grid; grid-template-columns: auto 1fr auto 1fr auto 1fr; grid-column-gap: 8px; width: 100%; font-size: 0.75em; line-height: 1.8; font-weight: 300">
      <div style="grid-column: 1 / 2; font-weight: 500;">Rating</div>
      <div style="grid-column: 2 / 3">{{ item.SubRating }}</div>
      <div style="grid-column: 3 / 4; font-weight: 500;">Format</div>
      <div style="grid-column: 4 / 5">{{ item.SubFormat }}</div>
      <div style="grid-column: 5 / 6; font-weight: 500;">Language</div>
      <div style="grid-column: 6 / 7">{{ item.LanguageName }}</div>
    </div>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import { OpensubtitlesState } from '@/search/state/types';

declare const props: {
  item: OpensubtitlesState;
};

export default {
  emits: ['select']
};

export const select = (selected) => emit('select', selected);
</script>

<style scoped>
/* plussub header */
.subtitle-selection-content--container--card {
  background-color: var(--surface-color);
  display: grid;
  grid-template-areas:
    '.       .       .'
    '.       header  .'
    '.       .       .'
    '.       content .'
    '.       .       .';
  grid-template-rows: 16px auto 16px 1fr 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  min-width: 100%;
}

.subtitle-selection-content--container--card:hover {
  background-color: var(--hoverColorOnSurfce);
  cursor: pointer;
}
</style>
