<template>
    <div class="flex gap-3">
      <label for="excerpt" class="pr-1">Excerpt</label>
      <input id="excerpt" type="radio" :value="first" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" @input="$emit('update:modelValue', $event.target.value)" />
      <label for="diagram" class="pr-1">Diagram</label>
      <input id="diagram" type="radio" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" :value="second" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true
    },
    first: {
      type: String as PropType<string>,
      required: true
    },
    second: {
      type: String as PropType<string>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const firstInput = ref<HTMLInputElement | null>(null);
    return {
      firstInput,
      change: () => emit('update:modelValue', firstInput.value?.getAttribute('checked') === null ? props.first : props.second)
    };
  }
});
</script>
