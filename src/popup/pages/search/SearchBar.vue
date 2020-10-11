<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <Spinner v-show="loadingRef && internalQuery" style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px" />
    <input ref="inputRef" v-on:keydown.prevent="onKeydown" autofocus style="grid-area: bar" placeholder="Search movie or series" id="search" type="text" v-model="internalQuery" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="grid-area: button; width: 40px"><i class="fa fa-search fa-lg"></i></a>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, watch, computed } from 'vue';
import { debounce } from '@/composables';
import { searchRequest } from '@/search/searchRequest';
import { useKeydownPreventInputHandler } from '@/composables';
import { TmdbState } from '../appState';

export { default as Spinner } from '@/components/Spinner';

declare const props: {
  query: string;
  loading: boolean;
  searchResults: TmdbState;
};

export default {
  emits: ['update:searchResults', 'update:loading', 'update:query']
};

export const searchResults = computed({
  get: () => props.searchResults,
  set: (val) => emit('update:searchResults', val)
});

export const loadingRef = computed({
  get: () => props.loading,
  set: (val) => emit('update:loading', val)
});

export const internalQuery = computed({
  get: () => props.query ?? '',
  set: (val) => emit('update:query', val)
});
const { fn: req } = debounce({
  fn: searchRequest,
  timeout: 1500,
  resultRef: searchResults,
  loadingRef
});
watch(internalQuery, (query) => req(query), { immediate: true });

export const inputRef = ref(null);
export const onKeydown = useKeydownPreventInputHandler({
  allowedInputValue: /^[0-9a-zA-Z _]$/,
  inputRef,
  valueRef: internalQuery
});
</script>

<style scoped>
/* plussub header */
.knopf-group.search-bar--container {
  display: grid;
  grid-template-areas: 'bar button';
  grid-template-columns: 1fr auto;
}
</style>
