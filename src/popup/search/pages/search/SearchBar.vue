<template>
  <div class="grid focus-within:text-primary-700" style="grid-template-areas: 'bar'; grid-template-columns: 1fr; grid-template-rows: 30px">
    <input
      ref="input"
      v-model="internalQuery"
      class="rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50"
      autofocus
      style="grid-area: bar"
      placeholder="Search movie or series"
      type="text"
      @keydown.stop
      @keypress.stop
    />
    <div class="justify-self-end self-center mr-2 text" style="grid-area: bar">
      <Spinner v-if="loading && internalQuery" class="text-spinner-box" />
      <fa v-else-if="internalQuery" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
      <fa v-else icon="search" class="h-icon-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { default as Spinner } from '@/components/Spinner.vue';

export default defineComponent({
  components: {
    Spinner
  },
  props: {
    query: {
      type: String as PropType<string>,
      required: true
    },
    loading: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['update:loading', 'update:query'],
  setup(props, { emit }) {
    const internalQuery = computed({
      get: () => props.query ?? '',
      set: (val) => emit('update:query', val)
    });
    const input = ref<HTMLInputElement | null>(null);
    return {
      input,
      internalQuery,
      clear: () => {
        internalQuery.value = '';
        input.value?.focus();
      }
    };
  }
});
</script>
