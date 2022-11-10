<template>
  <div style="grid-template-columns: auto auto 1fr; grid-column-gap: 24px; grid-row-gap: 24px" class="grid w-fullleading-relaxed">
    <ToggleButton v-model='enableColor'/>
    <div class="self-center font-medium text-sm" >Text color</div>
    <input v-model="color" type="color" class="self-center justify-self-center w-full"/>

    <ToggleButton v-model='enableColor' style='grid-column-start: 1'/>
    <div class="self-center font-medium text-sm">Background color</div>
    <input v-model="backgroundColor" type="color" class="self-end justify-self-center w-full" />

    <ToggleButton v-model='enableColor'/>
    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Transparency <span class='text-xs font-light'>({{backgroundColorTransparency}})</span></div>
      <RangeInputField  v-model="backgroundColorTransparency" step="1" min="0" max="255" class='w-full my-2' />
    </div>

    <ToggleButton v-model='enableColor'/>
    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Position <span class='text-xs font-light'>({{line}}%)</span></div>
      <RangeInputField v-model="line" step="1" min="1" max="100" class='w-full my-2'/>
    </div>

    <ToggleButton v-model='snapToLines'/>
    <div class="font-medium text-sm self-center" style='grid-column: 2/-1'>
      <div>Prevent the subtitle to get covered from controls. </div>
      <SnapToLinesHint/>
    </div>

    <ToggleButton v-model='enableColor'/>
    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Font size <span class='text-xs font-light'>({{fontSize}}px)</span></div>
      <RangeInputField v-model="fontSize" min="1" max="70" step="1" class='w-full my-2'></RangeInputField>
    </div>

    <ToggleButton v-model='enableColor'/>
    <div class="font-medium text-sm self-center" style='grid-column: 2/-1'>
      <div>Outline font </div>
      <div class='font-normal italic text-xs'>For a better contrast on bright screens</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import RangeInputField from '@/components/RangeInputField.vue';
import SnapToLinesHint from 'SnapToLinesHint.vue';
import { useStore as useAppearanceStore } from '@/appearance/store';
import ToggleButton from '@/components/ToggleButton.vue';

export default defineComponent({
  components: {
    ToggleButton,
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
      enableColor: ref(true),
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
