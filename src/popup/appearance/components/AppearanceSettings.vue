<template>
  <div style="grid-template-columns: auto 1fr 1fr; grid-column-gap: 0.5rem; grid-row-gap: 1rem" class="grid w-full leading-relaxed">
    <div class="self-center font-medium text-sm">Text color</div>
    <input v-model="color" type="color" class="self-center justify-self-center" />
    <div>
      <span class="text-xs">Transparency</span>
      <RangeInputField step="1" min="0" max="255" class="mt-2 pb-2" />
    </div>

    <!--    <div class="self-end font-medium">Bg color</div>-->
    <!--    <input v-model="backgroundColor" type="color" class="self-end justify-self-center">-->
    <!--    <div>-->
    <!--      <span class="text-xs">Transparency</span>-->
    <!--      <RangeInputField step="1" min="0" max="255" class="mt-2 pb-2"/>-->
    <!--    </div>-->

    <div class="font-medium text-sm self-center">Font size</div>
    <div class="flex pr-2" style="width: 120px">
      <NumberInputField v-model="fontSize" class="pr-2" />
      <div>px</div>
    </div>
    <RangeInputField v-model="fontSize" min="1" max="70" step="1"></RangeInputField>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import RangeInputField from '@/components/RangeInputField.vue';
import { useInjectStore } from '@/composables/useInjectStore';
import NumberInputField from '@/components/NumberInputField.vue';

export default defineComponent({
  components: {
    NumberInputField,
    RangeInputField
  },
  setup() {
    const appearanceStore = useInjectStore('appearanceStore');
    const backgroundColor = ref(appearanceStore.state.style.value['backgroundColor'] ?? '#ffffff');

    // todo debounce
    const color = ref(appearanceStore.state.style.value['color'] ?? '#000000');

    const fontSize = ref(appearanceStore.state.style.value['fontSize'] ?? 16);

    watch([backgroundColor, color, fontSize], ([backgroundColor, color, fontSize]) => {
      appearanceStore.actions.applyStyle({
        color,
        backgroundColor,
        fontSize
      });
    });

    return {
      backgroundColor,
      color,
      fontSize
    };
  }
});
</script>
