<template>
  <div class="flex flex-row-reverse justify-center pt-4">
    <SuffixIconButton
      label="Remove Subtitle"
      icon="eject"
      class="flex flex-row-reverse rounded-full px-2 py-2 border-solid border-2 border-primary-500 hover:border-primary-700 hover:bg-surface-200 hover:cursor-pointer"
      @click="store.removeResult"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SuffixIconButton from '@/components/SuffixIconButton.vue';
import { useStore } from '@/home/pages/homeStore';

export default defineComponent({
  components: {
    SuffixIconButton
  },
  setup(){
    const store = useStore();
    return {
      store
    }
  }
});
</script>
