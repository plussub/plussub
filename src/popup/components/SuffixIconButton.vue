<template>
  <div>
    <a class="flex text-primary-500 hover:text-primary-700">
      <span class="pr-1 align-center">
        <slot name="label">{{ label }} </slot>
      </span>
      <fa :icon="icon" :type="iconType" class="h-icon-sm self-center" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    icon: {
      type: String as PropType<string>,
      required: true
    },
    iconType: {
      type: String as PropType<string>,
      default: 'fas',
      required: false
    }
  }
});
</script>
