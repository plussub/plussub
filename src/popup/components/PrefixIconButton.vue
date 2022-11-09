<template>
  <div class='text-primary-500 hover:text-primary-700'>
    <a class="flex">
      <FontAwesomeIcon
        :icon="icon"
        :type="iconType"
        class="self-center"
        :class="{ 'h-icon-sm': iconSize === 'small', 'pr-1': iconSize === 'small', 'pr-2': iconSize === 'large', 'h-icon': iconSize === 'large' }"
      />
      <span class="self-center">
        <slot name="label"> {{ label }} </slot>
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FontAwesomeIcon from './FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
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
    },
    iconSize: {
      type: String as PropType<string>,
      default: 'small'
    }
  }
});
</script>
