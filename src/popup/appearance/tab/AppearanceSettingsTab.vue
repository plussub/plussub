<template>
  <div style="grid-template-columns: auto auto 8px auto auto; grid-column-gap: 14px; grid-row-gap: 24px" class="grid w-full leading-relaxed">
    <div class="self-center font-medium text-sm">Text</div>
    <input v-model="color" type="color" class="self-center justify-self-center" />

    <div class="self-center font-medium text-sm" style='grid-column: -2'>Background</div>
    <input v-model="backgroundColor" type="color" class="self-end justify-self-center" style='grid-column: -1' />

    <div class="font-medium text-sm self-center" style='grid-column: 1/3'>Transparency <span class='text-xs font-light'>({{backgroundColorTransparency}})</span></div>
    <RangeInputField  v-model="backgroundColorTransparency" style='grid-column: 3/end' step="1" min="0" max="255" class="mt-2 pb-2" />

    <div class="font-medium text-sm self-center" style='grid-column: 1/3'>Position <span class='text-xs font-light'>({{line}}%)</span></div>
    <RangeInputField v-model="line" style='grid-column: 3/end' step="1" min="1" max="100" class="mt-2 pb-2" />

    <div class="font-medium text-sm self-center" style='grid-column: 1/6'>
      <div>Prevent the subtitle to get covered from controls. </div>
      <SnapToLinesHint/>
    </div>
    <input v-model="snapToLines" type="checkbox" style='grid-column: 6/end' class="text-primary-700 focus:ring-0 focus:ring-offset-0 text-sm self-center" />

    <div class="font-medium text-sm self-center" style='grid-column: 1/3'>Font size <span class='text-xs font-light'>({{fontSize}}px)</span></div>
    <RangeInputField v-model="fontSize" style='grid-column: 3/end' min="1" max="70" step="1"></RangeInputField>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import RangeInputField from '@/components/RangeInputField.vue';
import SnapToLinesHint from 'SnapToLinesHint.vue';
import { useStore as useAppearanceStore } from '@/appearance/store';

export default defineComponent({
  components: {
    SnapToLinesHint,
    RangeInputField
  },
  setup() {
    const appearanceStore = useAppearanceStore();

    const calcColor = (color, fb) => (color ? color.slice(0, 7) : fb);
    const calcTransparency = (color, fb) => parseInt(color && color.length > 7 ? color.slice(-2) : fb, 16).toString();

    const backgroundColor = ref(calcColor(appearanceStore.style['cssBackgroundColor'], '#000000'));
    const backgroundColorTransparency = ref(calcTransparency(appearanceStore.style['cssBackgroundColor'], '00'));
    const backgroundColorWithTransparency = computed(() => backgroundColor.value + parseInt(backgroundColorTransparency.value, 10).toString(16));

    const color = ref(calcColor(appearanceStore.style['cssColor'], '#ffffff'));
    const fontSize = ref(appearanceStore.style['cssFontSize'] ?? 16);

    const line = ref(appearanceStore.style['cueLine'] ?? "80")
    const snapToLines = ref(appearanceStore.style['cueSnapToLines'] ?? false)

    watch([color, backgroundColorWithTransparency, fontSize, line, snapToLines], ([cssColor, cssBackgroundColor, cssFontSize, cueLine, cueSnapToLines]) => {
      appearanceStore.setStyle({
        cssColor,
        cssBackgroundColor,
        cssFontSize,
        cueLine: parseInt(cueLine, 10),
        cueSnapToLines
      });
      appearanceStore.applyStyle();
    });

    return {
      backgroundColor,
      backgroundColorTransparency,
      color,
      fontSize,
      line,
      snapToLines
    };
  }
});
</script>