<template>
  <div>filename: {{ filename }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useInjectStore } from '@/composables/useInjectStore';

export default defineComponent({
  setup() {
    const fileStore = useInjectStore('fileStore');
    return {
      filename: fileStore.state.value.filename
    };
  }
});
</script>
