<template>
  <div>
    <div class="flex justify-around relative mt-1">
      <PrefixIconButton icon="clock" icon-size="large" class="py-3" :class="{ 'border-b-2': selectedArea === 'time', 'text-primary-700': selectedArea === 'time' }" @click="selectedArea = 'time'">
        <template #label>
          <span>{{ currentTime }}</span>
        </template>
      </PrefixIconButton>
      <PrefixIconButton icon="palette" icon-size="large" class="py-3" :class="{ 'border-b-2': selectedArea === 'appearance', 'text-primary-700': selectedArea === 'appearance' }" @click="selectedArea = 'appearance'">
      </PrefixIconButton>
      <PrefixIconButton
        icon-type="local"
        icon="caption"
        icon-size="large"
        class="py-3"
        :class="{ 'border-b-2': selectedArea === 'transcript', 'text-primary-700': selectedArea === 'transcript' }"
        @click="selectedArea = 'transcript'"
      />
      <PrefixIconButton
        icon="question-circle"
        icon-size="large"
        class="py-3"
        :class="{ 'border-b-2': selectedArea === 'info', 'text-primary-700': selectedArea === 'info' }"
        @click="selectedArea = 'info'"
      />
      <Divider class="absolute w-full bottom-0 border-surface-200"></Divider>
    </div>

    <div class="mx-9 mt-8">
      <TimeSettings v-if="selectedArea === 'time'"></TimeSettings>
      <AppearanceSettings v-if="selectedArea === 'appearance'"></AppearanceSettings>
      <TranscriptPanel v-if="selectedArea === 'transcript'"/>
      <slot v-if="selectedArea === 'info'" name="info"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Duration } from 'luxon';
import PrefixIconButton from '@/components/PrefixIconButton.vue';
import Divider from '@/components/Divider.vue';
import TimeSettings from '@/subtitle/components/TimeSettings.vue';
import { useInjectStore } from '@/composables/useInjectStore';
import TranscriptPanel from "@/subtitle/components/TranscriptPanel.vue";
import AppearanceSettings from "@/appearance/components/AppearanceSettings.vue";

export default defineComponent({
  components: {
    AppearanceSettings,
    TranscriptPanel,
    TimeSettings,
    Divider,
    PrefixIconButton
  },
  setup() {
    const videoStore = useInjectStore('videoStore');
    return {
      selectedArea: ref('time'),
      currentTime: computed(() => Duration.fromMillis(parseInt(videoStore.getters.current.value?.lastTimestamp ?? '0', 10)).toFormat('hh:mm:ss')),
      previewSelection: ref('excerpt')
    };
  }
});
</script>
