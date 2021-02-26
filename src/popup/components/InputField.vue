<template>
  <sl-input ref="input" :value="modelValue" :placeholder="placeholder" @sl-input="change" @keydown.stop @keypress.stop>
    <div slot="suffix">
      <fa v-if="modelValue || placeholderIcon === ''" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
      <fa v-else :icon="placeholderIcon" class="h-icon-sm" />
    </div>
  </sl-input>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref} from 'vue';

export default defineComponent({
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref<HTMLInputElement & {setFocus: ()=>Promise<unknown>} | null>(null);

    return {
      change: () => setTimeout(() => emit('update:modelValue', input.value?.getAttribute('value') ?? ''), 20),
      input,
      clear: () => emit('update:modelValue', '')
    };
  }
});
</script>
