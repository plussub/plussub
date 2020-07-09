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

export default {
  setup() {
    const state = reactive({ entries: [] });
    useEventBusListener('searchResult', (entries) => {
      state.entries = entries;
    });

    return {
      state,
      useEventBusListener
    };
  }
};
</script>
