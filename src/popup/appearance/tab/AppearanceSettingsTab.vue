<template>
  <div style="grid-template-columns: auto auto 1fr; grid-column-gap: 24px; grid-row-gap: 24px" class="grid w-fullleading-relaxed">
    <ToggleButton v-model='enableColor'/>
    <div class="self-center font-medium text-sm" >Text color</div>
    <input v-model="color" type="color" class="self-center justify-self-center w-full"/>


    <Divider class='bottom-0 border-surface-200' style='grid-column: 1/-1'></Divider>

    <ToggleButton v-model='enableBackgroundColor' style='grid-column-start: 1'/>

    <div class="self-center font-medium text-sm" style='grid-column-start: 2'>Background color</div>
    <input v-model="backgroundColor" type="color" class="self-end justify-self-center w-full" style='grid-column-start: 3'/>


    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Transparency <span class='text-xs font-light'>({{backgroundColorTransparency}})</span></div>
      <RangeInputField  v-model="backgroundColorTransparency" step="1" min="0" max="255" class='w-full my-2' />
    </div>

    <Divider class='bottom-0 border-surface-200' style='grid-column: 1/-1'></Divider>


    <ToggleButton v-model='enableLine'/>
    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Position <span class='text-xs font-light'>({{line}}%)</span></div>
      <RangeInputField v-model="line" step="1" min="1" max="100" class='w-full my-2'/>
    </div>

    <Divider class='bottom-0 border-surface-200' style='grid-column: 1/-1'></Divider>

    <ToggleButton v-model='snapToLines'/>
    <div class="font-medium text-sm self-center" style='grid-column: 2/-1'>
      <div>Prevent the subtitle to get covered from controls. </div>
      <SnapToLinesHint/>
    </div>

    <Divider class='bottom-0 border-surface-200' style='grid-column: 1/-1'></Divider>

    <ToggleButton v-model='enableFontSize'/>
    <div style='grid-column: 2/-1'>
      <div class="font-medium text-sm self-center">Font size <span class='text-xs font-light'>({{fontSize}}px)</span></div>
      <RangeInputField v-model="fontSize" min="1" max="70" step="1" class='w-full my-2'></RangeInputField>
    </div>

    <Divider class='bottom-0 border-surface-200' style='grid-column: 1/-1'></Divider>

    <ToggleButton v-model='enableTextShadow'/>
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
import Divider from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider,
    ToggleButton,
    SnapToLinesHint,
    RangeInputField
  },
  setup() {
    const appearanceStore = useAppearanceStore();

    const calcColor = (color, fb) => (color ? color.slice(0, 7) : fb);
    const calcTransparency = (color, fb) => parseInt(color && color.length > 7 ? color.slice(-2) : fb, 16).toString();

    const backgroundColor = ref(calcColor(appearanceStore.style['cssBackgroundColor'], '#000000'));
    const enableBackgroundColor = ref(appearanceStore.enabled['cssBackgroundColor'] ?? false);
    const backgroundColorTransparency = ref(calcTransparency(appearanceStore.style['cssBackgroundColor'], '00'));
    const backgroundColorWithTransparency = computed(() => backgroundColor.value + parseInt(backgroundColorTransparency.value, 10).toString(16));

    const color = ref(calcColor(appearanceStore.style['cssColor'], '#ffffff'));
    const enableColor = ref(appearanceStore.enabled['cssColor'] ?? false);

    const fontSize = ref(appearanceStore.style['cssFontSize'] ?? 16);
    const enableFontSize = ref(appearanceStore.enabled['cssFontSize'] ?? false);

    const line = ref(appearanceStore.style['cueLine'] ?? "80")
    const enableLine = ref(appearanceStore.enabled['cueLine'] ?? false);

    const snapToLines = ref(appearanceStore.style['cueSnapToLines'] ?? true)

    const enableTextShadow = ref(appearanceStore.enabled['textShadow'] ?? false);

    watch([
      color,
      enableColor,
      backgroundColorWithTransparency,
      enableBackgroundColor,
      fontSize,
      enableFontSize,
      line,
      enableLine,
      snapToLines,
      enableTextShadow], ([cssColor, enableCssColor, cssBackgroundColor, enableCssBackgroundColor, cssFontSize, enableCssFontSize, cueLine, enableCueLine, cueSnapToLines, enableOutlineFont]) => {

      appearanceStore.setEnable({
        cssColor: enableCssColor,
        cssBackgroundColor: enableCssBackgroundColor,
        cssFontSize: enableCssFontSize,
        cssTextShadow: enableOutlineFont,
        cueLine: enableCueLine,
        cueSnapToLines: true,
      });

      appearanceStore.setStyle({
        cssColor,
        cssBackgroundColor,
        cssFontSize,
        cssTextShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        cueLine: parseInt(cueLine, 10),
        cueSnapToLines
      });

      appearanceStore.applyStyle();
    });

    return {
      backgroundColor,
      enableBackgroundColor,
      backgroundColorTransparency,
      color,
      enableColor,
      fontSize,
      enableFontSize,
      line,
      enableLine,
      snapToLines,
      enableTextShadow
    };
  }
});
</script>
