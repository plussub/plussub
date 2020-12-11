<template>
  <div class="grid w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer subtitle-selection-content--container--card py-2" @click="select(item)">
    <div class="font-header font-medium text-xl one-line" style="grid-area: header">
      {{ item.SubFileName }}
    </div>
    <div class="grid w-full text-xs font-light leading-relaxed pl-2" style="grid-area: content; grid-template-columns: auto 1fr auto 1fr auto 1fr; grid-column-gap: 8px;">
      <div style="grid-column: 1 / 2;" class="font-medium">Rating</div>
      <div style="grid-column: 2 / 3" >{{ item.SubRating }}</div>
      <div style="grid-column: 3 / 4;" class="font-medium">Format</div>
      <div style="grid-column: 4 / 5">{{ item.SubFormat }}</div>
      <div style="grid-column: 5 / 6;" class="font-medium">Language</div>
      <div style="grid-column: 6 / 7">{{ item.LanguageName }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { OpensubtitlesState } from '@/search/state';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<OpensubtitlesState>,
      required: true
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    return {
      select: (selected) => emit('select', selected)
    };
  }
});
</script>

<style scoped>
.subtitle-selection-content--container--card {
  grid-template-areas:
    '. header  .'
    '. .       .'
    '. content .';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: 8px 1fr 4px;
}
</style>
