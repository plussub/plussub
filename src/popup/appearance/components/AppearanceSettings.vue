<template>
  <div style="grid-template-columns: auto 1fr 1fr; grid-column-gap: 0.5rem" class="grid w-full leading-relaxed">
    <div class="font-medium">Text color</div>
    <input type="color" v-model="color">
    <RangeInputField step="1" min="0" max="255"/>

    <div class="font-medium">Background color</div>
    <input type="color" v-model="backgroundColor">
    <RangeInputField step="1" min="0" max="255"/>

  </div>
</template>

<script lang="ts">

import {defineComponent, ref, watch} from "vue";
import RangeInputField from "@/components/RangeInputField.vue";
import {useInjectStore} from "@/composables/useInjectStore";

export default defineComponent({
  components: {
    RangeInputField
  },
  setup() {
    const appearanceStore = useInjectStore('appearanceStore');

    const backgroundColor = ref('#ffffff');
    const color = ref('#ffffff');

    watch([backgroundColor, color], ([backgroundColor, color]) => {
      appearanceStore.actions.applyStyle({
        color,
        backgroundColor
      });
    });

    return {
      backgroundColor,
      color
    }
  }
});
</script>
