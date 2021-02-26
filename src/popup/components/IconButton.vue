<template>
  <a class="w-full flex text-primary-500 hover:text-primary-700">
    <span class="pr-1"> {{label}} </span>
    <fa :icon="icon" class="h-icon-sm self-center" />
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: true
    },
    icon: {
      type: String as PropType<string>,
      required: true
    }
  }
});
</script>
