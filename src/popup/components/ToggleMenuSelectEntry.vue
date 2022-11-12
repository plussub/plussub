<template>
  <a
    href='#'
    class='grid py-2 px-4 text-sm hover:bg-primary-700 hover:text-on-primary-700 gap-2'
    style='grid-template-columns: auto 1fr'
    @click='$emit("update:modelValue", !modelValue)'
  >
    <FontAwesomeIcon
      icon='check'
      type='fas'
      class='h-icon-sm self-center'
      :class='{"invisible": !modelValue}'
    />
    <slot>
    </slot>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FontAwesomeIcon from './FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    modelValue: {
      type: [Boolean],
      required: true
    },
  },
  emits: ['update:modelValue']
});
</script>