<template>
  <div class="grid focus-within:text-primary-700" style="display: grid; grid-template-areas: 'bar'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <input
      ref="input"
      v-model="internalFilter"
      class="rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50"
      autofocus
      style="grid-area: bar"
      placeholder="Filter subtitle result"
      type="text"
      @keydown.stop
      @keypress.stop
    />
    <div class="justify-self-end self-center mr-2 text" style="grid-area: bar">
      <fa v-if="internalFilter" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
      <fa v-else icon="filter" class="h-icon-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  emits: ['update:filter'],
  props: {
    filter: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props, { emit }) {
    const internalFilter = computed({
      get: () => props.filter ?? '',
      set: (val) => emit('update:filter', val)
    });
    const input = ref<HTMLInputElement | null>(null);

    return {
      input,
      internalFilter,
      clear: () => {
        internalFilter.value = '';
        input.value?.focus();
      }
    };
  }
});
</script>
