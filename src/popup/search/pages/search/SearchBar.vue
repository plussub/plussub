<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <Spinner v-show="loading && internalQuery" style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px" />
    <input id="search" ref="inputRef" v-model="internalQuery" autofocus style="grid-area: bar" placeholder="Search movie or series" type="text" @keydown.prevent="onKeydown" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="grid-area: button; width: 40px"><i class="fa fa-search fa-lg"></i></a>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, computed } from 'vue';
import { useKeydownPreventInputHandler } from '@/composables/useKeydownPreventInputHandler';


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


// use this to supress page shortcuts like f for fullscreen in youtube
// todo: support ctrl+v, ctrl+a
// todo: support other languages
// todo: find another more robust solution
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
