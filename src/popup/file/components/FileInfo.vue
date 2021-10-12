<template>
  <div style="grid-template-columns: auto 1fr; grid-column-gap: 0.5rem" class="grid w-full leading-relaxed">
    <div class="font-medium">Filename</div>
    <div>{{ filename }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useInjectStore } from '@/useInjectStore';

export default defineComponent({
  setup() {
    const fileStore = useInjectStore('fileStore');
    return {
      filename: fileStore.state.value.filename
    };
  }
});
</script>
