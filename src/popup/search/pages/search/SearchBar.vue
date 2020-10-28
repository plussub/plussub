<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <input id="search" v-model="internalQuery" autofocus style="grid-area: bar" placeholder="Search movie or series" type="text" @keydown.stop @keypress.stop />
    <div style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px">
      <Spinner v-if="loading && internalQuery"/>
      <fa v-else icon="search" style="height: var(--icon-size-sm)"/>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { computed } from 'vue';

export { default as Spinner } from '@/components/Spinner.vue';

declare const props: {
  query: string;
  loading: boolean;
};

export default {
  emits: ['update:loading', 'update:query']
};

export const internalQuery = computed({
  get: () => props.query ?? '',
  set: (val) => emit('update:query', val)
});

</script>

<style scoped>
/* plussub header */
.knopf-group.search-bar--container {
  display: grid;
  grid-template-areas: 'bar';
  grid-template-columns: 1fr;
}
</style>
