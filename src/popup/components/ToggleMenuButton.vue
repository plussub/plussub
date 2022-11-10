<template>
  <div>
      <FontAwesomeIcon
        icon='ellipsis-v'
        type='fas'
        class='h-icon hover:text-primary-700 hover:cursor-pointer'
        :class='{"text-primary-700": modelValue, "text-primary-500": !modelValue}'
        style='grid-column: 3'
        @click='toggle'
      />
  </div>
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      toggle: () => {
        emit('update:modelValue', !props.modelValue);
      }
    }
  }
});
</script>
