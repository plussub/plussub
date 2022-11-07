<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-file--card">
    <div class="absolute flex font-medium top-2.5 right-2.5">
      <div class="text-xs flex align-center text-primary-color-700">
        <FontAwesomeIcon icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="$emit('remove')" />
      </div>
    </div>
    <div class="flex mt-2 px-2 gap-2" style="grid-area: header">
      <div class="font-header font-medium text-2xl">Subtitle via file</div>
    </div>
    <div style="grid-area: settings">
      <slot name="settings" />
    </div>
    <div style="grid-area: actions" class="justify-end self-center px-4 flex">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon
  },
  emits: ['remove']
});
</script>

<style scoped>
.result-from-file--card {
  grid-template-areas:
    'header  '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: auto 1fr 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}
</style>
