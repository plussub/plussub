<template>
  <div class="w-full">
    <div class="flex justify-around relative pt-1 bg-primary-50 shadow-md">
      <slot name="time-settings-tab-header" :selected="selectedArea === 'time-settings'" :select="() => (selectedArea = 'time-settings')"> </slot>

      <slot name="appearance-settings-tab-header" :selected="selectedArea === 'appearance-settings'" :select="() => (selectedArea = 'appearance-settings')"> </slot>

      <slot name="transcript-tab-header" :selected="selectedArea === 'transcript'" :select="() => (selectedArea = 'transcript')"> </slot>

      <slot name="remove-subtitle-tab-header" :selected="selectedArea === 'remove-subtitle'" :select="() => (selectedArea = 'remove-subtitle')"> </slot>

      <slot name="info-tab-header" :selected="selectedArea === 'info'" :select="() => (selectedArea = 'info')"> </slot>
      <Divider class="absolute w-full bottom-0 border-surface-200"></Divider>
    </div>

    <div
      class="overflow-x-auto bg-surface-50"
      :class="{
        'px-4': selectedArea !== 'transcript',
        'py-4': selectedArea !== 'transcript'
      }"
      style="min-height: var(--setting-area-min-height); max-height: var(--setting-area-max-height)"
    >
      <slot v-if="selectedArea === 'time-settings'" name="time-settings-tab"></slot>
      <slot v-if="selectedArea === 'appearance-settings'" name="appearance-settings-tab"></slot>
      <slot v-if="selectedArea === 'transcript'" name="transcript-tab"></slot>
      <slot v-if="selectedArea === 'remove-subtitle'" name="remove-subtitle-tab"></slot>
      <slot v-if="selectedArea === 'info'" name="info-tab"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Divider from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider
  },
  setup() {
    return {
      selectedArea: ref('time-settings')
    };
  }
});
</script>

<style>
:host {
  --setting-area-max-height: 420px;
  --setting-area-min-height: var(--content-min-height);
}

@media (max-width: 600px) {
  :host {
    --setting-area-max-height: 150px;
    --setting-area-min-height: var(--content-min-height);
  }
}
</style>
