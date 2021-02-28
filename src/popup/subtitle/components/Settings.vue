<template>
  <div>
    <div class="flex justify-around relative mt-1">
      <PrefixIconButton icon="clock" icon-size="large" class="py-3" :class="{ 'border-b-2': selectedArea === 'time', 'text-primary-700': selectedArea === 'time' }" @click="selectedArea = 'time'">
        <template #label>
          <span>{{ currentTime }}</span>
        </template>
      </PrefixIconButton>
      <PrefixIconButton icon="palette" icon-size="large" class="py-3" :class="{ 'border-b-2': selectedArea === 'style', 'text-primary-700': selectedArea === 'style' }" @click="selectedArea = 'style'">
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
      <div v-if="selectedArea === 'style'">asdf</div>
      <slot v-if="selectedArea === 'info'" name="info"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { VideoStore } from '@/video/store';
import Duration from 'luxon/src/duration';
import { SubtitleStore } from '@/subtitle/store';
import PrefixIconButton from '@/components/PrefixIconButton.vue';
import Divider from '@/components/Divider.vue';
import TimeSettings from '@/subtitle/components/TimeSettings.vue';

export default defineComponent({
  components: {
    TimeSettings,
    Divider,
    PrefixIconButton
  },
  setup() {
    const videoStore = inject<VideoStore>('videoStore');
    if (!videoStore) {
      throw new Error('inject failed');
    }
    const currentTime = ref<string>(Duration.fromMillis(0).toFormat('hh:mm:ss'));
    videoStore.actions.useTimeUpdate(({ time }): void => {
      currentTime.value = Duration.fromMillis(time * 1000).toFormat('hh:mm:ss');
    });
    return {
      selectedArea: ref('time'),
      currentTime,
      previewSelection: ref('excerpt')
    };
  }
});
</script>
