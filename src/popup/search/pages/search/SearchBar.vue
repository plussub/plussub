<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <Spinner v-show="loading && internalQuery" style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px" />
    <input id="search" v-model="internalQuery" autofocus style="grid-area: bar" placeholder="Search movie or series" type="text" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="grid-area: button; width: 40px"><i class="fa fa-search fa-lg"></i></a>
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

// remove this to allow use ctrl+v and other languages(eg. Japanese) input
// export const inputRef = ref(null);
// export const onKeydown = useKeydownPreventInputHandler({
//   allowedInputValue: /^[0-9a-zA-Z _]$/,
//   inputRef,
//   valueRef: internalQuery
// });
</script>

<style scoped>
/* plussub header */
.knopf-group.search-bar--container {
  display: grid;
  grid-template-areas: 'bar button';
  grid-template-columns: 1fr auto;
}
</style>
