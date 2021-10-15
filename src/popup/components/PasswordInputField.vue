<template>
  <div class="grid focus-within:text-primary-700" style="display: grid; grid-template-areas: 'bar'; grid-template-columns: 1fr auto; grid-template-rows: 30px">
    <input
        ref="input"
        :value="modelValue"
        class="w-full rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50"
        autofocus
        style="grid-area: bar"
        :placeholder="placeholder"
        v-bind="$attrs"
        type="password"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.stop
        @keypress.stop
    />
    <div v-if="withClear" class="justify-self-end self-center mr-2 text" style="grid-area: bar">
      <FontAwesomeIcon v-if="modelValue || placeholderIcon === ''" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
      <FontAwesomeIcon v-else :icon="placeholderIcon" class="h-icon-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon
  },
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    placeholderIcon: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    placeholder: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    withClear: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref<HTMLInputElement | null>(null);

    return {
      input,
      clear: () => {
        emit('update:modelValue', "");
        input.value?.focus();
      }
    };
  }
});
</script>
