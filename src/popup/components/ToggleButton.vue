<template>
  <div class="flex items-center justify-center w-full self-center">
    <label class="flex items-center cursor-pointer">
      <!-- toggle -->
      <div class="relative">
        <!-- input $emit('update:modelValue', $event.target.value)-->
        <input ref="checkbox" class="sr-only" :checked="modelValue" type="checkbox" @input="input" />
        <!-- line -->
        <div class="w-10 h-4 bg-surface-300 rounded-full shadow-inner"></div>
        <!-- dot -->
        <div
          class="dot absolute w-6 h-6 rounded-full shadow -left-1 -top-1 transition border-solid border border-surface-500"
          :class='{"bg-surface-50": !modelValue, "bg-primary-700": modelValue, "translate-x-full": modelValue}'>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: [Boolean, String],
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const checkbox = ref<HTMLInputElement|null>(null)
    return {
      checkbox,
      input: () => emit('update:modelValue', checkbox.value?.checked ?? false)
    }
  }
});
</script>