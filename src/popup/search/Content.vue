<template>
  <div style="max-width: calc(100% - 32px); margin-left: 16px; margin-right: 16px;">
    search results
    <div v-for="item in state.entries">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { useEventBusListener } from '@/composables';
import { reactive } from 'vue';

/**
 * https://image.tmdb.org/t/p/w500/
 * id: "680"
 overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time."
 poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
 release_date: "1994-09-10"
 title: "Pulp Fiction"
 */

export default {
  setup() {
    const state = reactive({ entries: [] });
    useEventBusListener('searchResult', (entries) => {
      console.log(entries);
      state.entries = entries;
    });

    return {
      state,
      useEventBusListener
    };
  }
};
</script>
