<template>
  <div class="flex flex-col gap-3 h-full">
    <div
      ref="containerRef"
      style="width: calc(100% - 30px);"
      class="h-full relative flex flex-col text-center justify-evenly self-center justify-self-center box-border border-dashed border-2 border-primary-700 hover:bg-surface-100"
      @mouseenter="highlightCurrentVideo"
      @mouseleave="removeHighlightFromVideo"
      @dragenter.prevent="dragenter"
      @dragleave="dragleave"
      @drop.prevent="drop"
    >
      <p class="mt-6 self-center">
        <fa icon="upload" class="text-primary-700 h-icon-lg"/>
      </p>
      <input
        ref="inputRef"
        type="file"
        title="click or drop file here"
        accept=".vtt,.srt,.ass,.ssa"
        class="w-full h-full cursor-pointer absolute z-10 opacity-0"
        @change="fileSelected"
      />
      <div v-show="fileErrorMsg" class="absolute top-0 inset-x-0 p-2 flex place-content-center text-center z-30 bg-error text-on-error shadow">
        <div class="self-center rounded-full p-0.5 bg-error-icon mr-2">
          <fa icon="times" class="h-icon-sm w-icon-sm text-white"/>
        </div>
        <span class="self-center">{{ fileErrorMsg }}</span>
      </div>
      <div class="m-2">
        <p class="m-2">Click or drop file to this area to upload</p>
        <p class="m-2 text-sub-text-on-surface-50 text-sm">
          Support for a single file upload. Only .srt, .ass, .ssa and .vtt file is acceptable.(Video
          <span :class="{ 'text-primary-700': getVideoName() !== '1', 'hover:underline': getVideoName() !== '1'}" @click="changeQuery">{{ getVideoName() }}</span>
          is {{ videoCount === 1 ? 'auto' : '' }} selected)
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import { getVideoName } from '@/util/name';
import { OnLoadPayload, readFile } from './readFile';

import { videoCount, videosWithSubtitle, highlightCurrentVideo, removeHighlightFromVideo } from '@/video/state';
import { setSrc, setState } from '@/app/state';
import { parse, setRaw } from '@/subtitle/state';
import { getFormatFromFilename } from '@/subtitle/util';
import { setFilename } from '@/file/state';
import { toHome } from '@/navigation/state';

export default defineComponent({
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

    const containerRef = ref();
    const fileErrorMsg = ref('');
    const dragenter = (): void => containerRef.value.classList.add('bg-surface-200');
    const dragleave = (): void => containerRef.value.classList.remove('bg-surface-200');

    onUnmounted(() => removeHighlightFromVideo());

    const showFileErrorMsg = (msg: string) => {
      fileErrorMsg.value = msg;
      setTimeout(() => {
        fileErrorMsg.value = '';
      }, 2000);
      dragleave();
    };

    const onLoad = ({ fileName, result }: OnLoadPayload): void => {
      setFilename({ filename: fileName });
      setState({ state: 'SELECTED' });
      setSrc({ src: 'FILE' });

      setRaw({ raw: result, format: getFormatFromFilename(fileName), id: fileName });
      parse();
      toHome({
        contentTransitionName: 'content-navigate-select-to-home'
      });
    };
    const onError = (): void => showFileErrorMsg('Some error happened when parsing the subtitle');

    return {
      inputRef,
      containerRef,
      fileErrorMsg,
      dragenter,
      dragleave,
      getVideoName,
      highlightCurrentVideo,
      removeHighlightFromVideo,
      videoCount,
      videosWithSubtitle,

      drop: (event: DragEvent): void => {
        let droppedFiles = event.dataTransfer?.files;
        if (!droppedFiles) {
          showFileErrorMsg('Drop to upload file error');
          return;
        }
        if (droppedFiles.length > 1) {
          showFileErrorMsg('Only a single file is supported');
          return;
        }
        const file = droppedFiles[0];
        const filename = file.name;
        if (!filename.match(/\.(srt|vtt|ass|ssa)$/)) {
          showFileErrorMsg('Only .srt, .ass, .ssa and .vtt file is acceptable');
          return;
        }
        readFile({ file, onLoad, onError });
      },
      fileSelected: async (): Promise<void> => {
        if (!inputRef.value?.files) {
          showFileErrorMsg('Click to upload file error');
          return;
        }
        const file = inputRef.value.files[0];
        readFile({ file, onLoad, onError });
      }
    };
  }
});
</script>
