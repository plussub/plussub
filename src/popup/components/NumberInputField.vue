<template>
  <sl-input ref="input" :value="modelValue" :placeholder="placeholder" type="number" @input="change" @keydown.stop @keypress.stop>
    <div slot="suffix">
      <fa v-if="modelValue || placeholderIcon === ''" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
      <fa v-else :icon="placeholderIcon" class="h-icon-sm" />
    </div>
  </sl-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Number as PropType<number>,
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref<HTMLInputElement | null>(null);

    return {
      change: () => setTimeout(() => emit('update:modelValue', input.value?.getAttribute('value') ?? ''), 20),
      input,
      clear: () => emit('update:modelValue', '')
    };
  }
});
</script>

<style>

input[type=number]::-webkit-inner-spin-button {
  opacity: 1
}
input[type=range]:focus,input[type=range]:active,input[type=range] {
  -webkit-appearance: none;
  border: none;
  background-color: transparent;
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 1px;
  background: #374151;
  border: none;
  border-radius: 3px;
}

input[type=range]::-moz-range-track {
  height: 1px;
  background: #374151;
  border: none;
  border-radius: 3px;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #0e7490;
  margin-top: -6px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #0e7490;
  margin-top: -6px;
}

</style>
