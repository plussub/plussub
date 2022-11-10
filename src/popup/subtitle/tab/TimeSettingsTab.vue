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
        <FontAwesomeIcon
          icon='ellipsis-v'
          type='fas'
          class='h-icon hover:text-primary-700 hover:cursor-pointer'
          :class='{"text-primary-700": toggleMenu, "text-primary-500": !toggleMenu}'
          style='grid-column: 3'
          @click='toggleMenu = !toggleMenu'
        />
      </div>


      <div class='relative'>
        <div
          v-show='toggleMenu'
          class='z-10 w-44 right-0 text-base list-none bg-surface-100 rounded divide-y divide-gray-100 shadow absolute'>
          <ul class='py-1'>
            <li>
              <a
                href='#'
                class='grid py-2 px-4 text-sm hover:bg-primary-700 hover:text-on-primary-700 gap-2'
                style='grid-template-columns: auto 1fr'
                @click='selectExcerpt'
              >
                <FontAwesomeIcon
                  icon='check'
                  type='fas'
                  class='h-icon-sm self-center'
                  :class='{"invisible": previewSelection !== "excerpt"}'
                />
                <span>Excerpt</span>
              </a>
            </li>
            <li>
              <a
                href='#'
                class='grid py-2 px-4 text-sm hover:bg-primary-700 hover:text-on-primary-700 gap-2'
                style='grid-template-columns: auto 1fr'
                @click='selectDiagram'
              >
                <FontAwesomeIcon
                  icon='check'
                  type='fas'
                  class='h-icon-sm self-center'
                  :class='{"invisible": previewSelection !== "diagram"}'
                />
                <span>Diagram</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

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
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { useStore } from './timeSettingsTabStore';

export default defineComponent({
  components: {
    RangeInputField,
    Excerpt,
    Timeline,
    NumberInputField,
    FontAwesomeIcon
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
    const toggleMenu = ref(false);
    const previewSelection = ref('excerpt');

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
