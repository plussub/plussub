<template>
  <a class="flex">
    <sl-button type="text" size="large" class="plussub-icon-button" style="--sl-focus-ring-width: 0px;">
      {{label}}
      <fa slot="suffix" :icon="icon" class="h-icon-sm" />
    </sl-button>
  </a>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: true
    },
    icon: {
      type: String as PropType<string>,
      required: true
    }
  }
});
</script>

<style>
sl-button:hover.plussub-icon-button::part(label),
sl-button:hover.plussub-icon-button::part(suffix)  {
  color: var(--sl-color-primary-700)
}
</style>
