<template>
  <div style="grid-template-columns: auto 1fr; grid-column-gap: 0.5rem" class="grid w-full leading-relaxed">
    <div class="font-medium">Format</div>
    <div>{{ format }}</div>
    <div class="font-medium">Language</div>
    <div>{{ language }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    format: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: ""
    }
  }
});
</script>
