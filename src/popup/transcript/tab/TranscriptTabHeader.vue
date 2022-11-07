<template>
  <PrefixIconButton
    icon-type='local'
    icon='caption'
    icon-size='large'
    class='py-3'
    :class="{ 'border-b-2': selected, 'text-primary-700': selected }">
  </PrefixIconButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PrefixIconButton from '@/components/PrefixIconButton.vue';

export default defineComponent({
  components: {
    PrefixIconButton
  },
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  }
});
</script>