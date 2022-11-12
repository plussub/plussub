<template>
  <div>

    <div class='p-4 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
      <h1 class='mb-2 text-2xl font-bold tracking-tight'>Delay for subtitles</h1>
      <div class='flex pl-4 mt-4 w-full flex-wrap focus-within:text-primary-700'>
        <div class='text-xs font-medium w-full' style='grid-area: input-label'>Offset time (in ms)</div>
        <RangeInputField v-model='offsetTime' step='100' min='-3000' max='3000' class='mr-6 w-1/3 flex-grow' />
        <NumberInputField v-model='offsetTime' step='100' class='pr-2 w-1/2' />
      </div>
    </div>

    <div class='mt-4 p-4 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
      <div class='grid' style='grid-template-columns: auto 1fr auto'>
        <h1 class='mb-2 text-2xl font-bold tracking-tight' style='grid-column: 1'>Preview (next 3 subtitles)</h1>
        <ToggleMenuButton v-model='toggleMenu' style='grid-column: 3'/>
      </div>

      <ToggleMenu v-show='toggleMenu'>
        <li>
          <ToggleMenuSelectEntry :model-value='previewSelection === "excerpt"' @update:model-value='selectExcerpt'>
            <span>Excerpt</span>
          </ToggleMenuSelectEntry>
        </li>
        <li>
          <ToggleMenuSelectEntry :model-value='previewSelection === "diagram"' @update:model-value='selectDiagram'>
            <span>Diagram</span>
          </ToggleMenuSelectEntry>
        </li>
      </ToggleMenu>

      <Excerpt
        v-if="previewSelection === 'excerpt'"
        style='grid-area: preview; height: 150px; width: calc(100% - 12px)'
        class='pl-4'
        :excerpt='store.excerpt'>
        <template #from='{from}'>
          <span class='mr-2'>{{ store.formatTime(from) }}</span>
        </template>
        <template #to='{to}'>
          <span>{{ store.formatTime(to) }}</span>
        </template>
      </Excerpt>

      <Timeline
        v-else
        :excerpt='store.excerpt'
        :current-time='store.currentTime'
        class='mt-4'
        style='grid-area: preview; height: 80px; width: calc(100% - 12px)' />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue';
import Timeline from '@/subtitle/components/Timeline.vue';
import Excerpt from '@/subtitle/components/Excerpt.vue';
import NumberInputField from '@/components/NumberInputField.vue';
import RangeInputField from '@/components/RangeInputField.vue';
import { useStore } from './timeSettingsTabStore';
import ToggleMenuButton from '@/components/ToggleMenuButton.vue';
import ToggleMenu from '@/components/ToggleMenu.vue';
import ToggleMenuSelectEntry from '@/components/ToggleMenuSelectEntry.vue';

export default defineComponent({
  components: {
    ToggleMenuSelectEntry,
    ToggleMenu,
    ToggleMenuButton,
    RangeInputField,
    Excerpt,
    Timeline,
    NumberInputField
  },
  setup() {
    const store = useStore();

    const offsetTime = computed({
      get: () => store.offsetTime,
      set: (val) => {
        if (val === undefined) {
          return;
        }
        store.setOffsetTime({ offsetTime: parseInt(val.toString(), 10) });
      }
    });
    const previewSelection = ref('excerpt');
    const toggleMenu = ref(false);

    return {
      store,
      offsetTime,
      toggleMenu,
      reset: () => (offsetTime.value = 0),
      previewSelection,
      selectExcerpt: () => {
        toggleMenu.value = false;
        previewSelection.value = 'excerpt';
      },
      selectDiagram: () => {
        toggleMenu.value = false;
        previewSelection.value = 'diagram';
      }
    };
  }
});
</script>
