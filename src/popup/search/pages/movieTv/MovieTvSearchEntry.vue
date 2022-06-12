<template>
  <div class="grid w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer search-content--container--card" @click="select(item)">
    <div style="grid-area: poster">
      <img v-if="item.poster_path" :src="item.poster_path" class="h-full w-full object-cover" style="max-height: var(--image-height)" />
      <div v-else class="flex justify-center align-center h-full">
        <FontAwesomeIcon icon="question" class="h-full"></FontAwesomeIcon>
      </div>
    </div>
    <div style="grid-area: title">
      <div class="font-header font-medium text-xl two-lines">
        {{ item.title }}
      </div>
      <div class="text-xs font-medium mt-2 pl-2">
        {{ capitalize(item.media_type) }}
        {{ item.release_date ? '/ ' + item.release_date.substr(0, 4) : '' }}
      </div>
      <div class="text-xs mt-1 pl-2">tmdb {{ item.vote_average }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { VideoSearchResultEntry } from './searchQuery';
import { useStringFn } from '@/composables';

import { default as posterFallback } from '@/res/posterFallback.png';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    item: {
      type: Object as PropType<VideoSearchResultEntry>,
      required: true
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const {capitalize} = useStringFn();

    return {
      posterFallback,
      select: (selected) => emit('select', selected),
      capitalize
    };
  }
});
</script>
<style scoped>
.search-content--container--card {
  --image-height: 120px;
  grid-template-areas:
    'poster . .     .'
    'poster . title .';
  grid-template-rows: 8px 110px;
  grid-template-columns: 60px 16px 1fr 4px;
}
</style>
