<template>
  <sl-form>
    <div class="flex gap-3">
      <sl-radio ref="firstInput" checked name="radio" @sl-change="change">
        <slot name="first"/>
      </sl-radio>
      <sl-radio name="radio" @sl-change="change">
        <slot name="second"/>
      </sl-radio>
    </div>
  </sl-form>
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
    },
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
