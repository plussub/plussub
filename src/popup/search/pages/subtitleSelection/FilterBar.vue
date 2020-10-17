<template>
  <div class="knopf-group" style="display: flex">
    <input id="search" ref="inputRef" v-model="filter" autofocus style="flex-grow: 1" placeholder="Filter subtitle result" type="text" @keydown.prevent="onKeydown" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="width: 40px"><i class="fa fa-filter fa-lg"></i></a>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, computed } from 'vue';
import { useKeydownPreventInputHandler } from '@/composables';

declare const props: {
  filter: string;
};

export default {
  emits: ['update:filter']
};

export const filter = computed({
  get: () => props.filter,
  set: (val) => emit('update:filter', val)
});

const inputRef = ref(null);
export const onKeydown = useKeydownPreventInputHandler({
  allowedInputValue: /^[0-9a-zA-Z _]$/,
  inputRef,
  valueRef: filter
});
</script>
