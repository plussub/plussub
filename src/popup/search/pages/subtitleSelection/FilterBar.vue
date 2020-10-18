<template>
  <div class="knopf-group" style="display: flex">
    <input v-model="internalFilter" autofocus style="flex-grow: 1" placeholder="Filter subtitle result" type="text" @keydown.stop @keypress.stop />
    <a class="knopf flat pill sharp buttonOnPrimary" style="width: 40px"><i class="fa fa-filter fa-lg"></i></a>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { computed } from 'vue';

declare const props: {
  filter: string;
};

export default {
  emits: ['update:filter']
};

export const internalFilter = computed({
  get: () => props.filter ?? '',
  set: (val) => emit('update:filter', val)
});

</script>
