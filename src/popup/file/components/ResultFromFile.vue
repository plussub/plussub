<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-file--card">
    <div class="absolute flex font-medium top-2.5 right-2.5">
      <div class="text-xs flex align-center">
        <fa icon="times" class="h-icon-sm hover:text-destructive-icon" @click="$emit('remove')" />
      </div>
    </div>
    <div class="flex mt-2 px-2 gap-2" style="grid-area: header">
      <div class="font-header font-medium text-2xl">Subtitle via file</div>
      <div class="self-center" :title="infoTooltip">
        <fa icon="question-circle" class="h-icon hover:text-primary-700" />
      </div>
    </div>
    <div style="grid-area: loading" class="flex items-center">
      <LoadingBar :loading="appState.state !== 'DONE'" :error="appState.state === 'ERROR'" class="w-full" />
    </div>
    <div class="px-4" style="grid-area: settings">
      <slot name="settings" />
    </div>
    <div class="justify-self-end self-center px-4" style="grid-area: actions">
      <a class="w-full flex text-primary-500 hover:text-primary-700" @mouseenter="highlightCurrentVideo" @mouseleave="removeHighlightFromVideo">
        <span class="pr-1"> Highlight video </span>
        <fa icon="crosshairs" class="h-icon-sm self-center" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onUnmounted } from 'vue';
import { capitalizeFirst } from '@/util/string';
import { FileStore } from '@/file/store';
import LoadingBar from '@/components/LoadingBar.vue';
import { highlightCurrentVideo, removeHighlightFromVideo } from '@/video/state';
import { AppStore } from '@/app/store';

export default defineComponent({
  components: {
    LoadingBar
  },
  emits: ['remove'],
  setup() {
    const appStore = inject<AppStore>('appStore');
    const fileStore = inject<FileStore>('fileStore');
    if (!appStore || !fileStore) {
      throw new Error('inject failed');
    }

    onUnmounted(() => {
      removeHighlightFromVideo();
    });

    return {
      appState: appStore.state,
      highlightCurrentVideo,
      removeHighlightFromVideo,
      infoTooltip: computed(() => [`filename - ${fileStore.state.value.filename}`, `state - ${capitalizeFirst(appStore.state.value.state)}`].join('\n'))
    };
  }
});
</script>

<style scoped>
.result-from-file--card {
  grid-template-areas:
    'header  '
    'loading '
    '.       '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: auto 8px 16px 1fr 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}
</style>
