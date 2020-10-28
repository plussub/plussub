<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <input v-model="internalFilter" autofocus style="grid-area: bar" placeholder="Filter subtitle result" type="text" @keydown.stop @keypress.stop />
    <div style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px">
      <fa icon="filter" style="height: var(--icon-size-sm)"/>
    </div>
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
