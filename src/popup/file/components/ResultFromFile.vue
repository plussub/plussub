<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-file--card">
    <div class="absolute flex font-medium top-2.5 right-2.5">
      <div class="text-xs flex align-center text-primary-color-700">
        <fa icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="remove" />
      </div>
    </div>
    <div class="flex mt-2 px-2 gap-2" style="grid-area: header">
      <div class="font-header font-medium text-2xl">Subtitle via file</div>
    </div>
    <div class="px-4" style="grid-area: settings">
      <slot name="settings" />
    </div>
    <IconButton
        class="justify-end self-center px-4 w-full"
        style="grid-area: actions"
        label="Highlight video"
        icon="crosshairs"
        @mouseenter="highlightCurrentVideo"
        @mouseleave="removeHighlightFromVideo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onUnmounted } from 'vue';
import { capitalizeFirst } from '@/util/string';
import { FileStore } from '@/file/store';
import { AppStore } from '@/app/store';
import { SubtitleStore } from '@/subtitle/store';
import { VideoStore } from '@/video/store';
import IconButton from '@/components/IconButton.vue';

export default defineComponent({
  components: {
    IconButton
  },
  setup() {
    const appStore = inject<AppStore>('appStore');
    const fileStore = inject<FileStore>('fileStore');
    const subtitleStore = inject<SubtitleStore>('subtitleStore');
    const videoStore = inject<VideoStore>('videoStore');

    if (!appStore || !fileStore || !subtitleStore || !videoStore) {
      throw new Error('inject failed');
    }

    onUnmounted(() => {
      videoStore.actions.removeHighlight();
    });

    return {
      appState: appStore.state,
      remove: () => {
        appStore.actions.reset();
        fileStore.actions.reset();
        subtitleStore.actions.reset();
        videoStore.actions.removeCurrent();
      },
      highlightCurrentVideo: () => videoStore.actions.highlight({ video: videoStore.getters.current.value }),
      removeHighlightFromVideo: videoStore.actions.removeHighlight,
      infoTooltip: computed(() => [`filename - ${fileStore.state.value.filename}`, `state - ${capitalizeFirst(appStore.state.value.state)}`].join('\n'))
    };
  }
});
</script>

<style scoped>
.result-from-file--card {
  grid-template-areas:
    'header  '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: auto 1fr 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}
</style>
