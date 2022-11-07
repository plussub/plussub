<template>
  <div class="flex flex-col gap-3 h-full">
    <div
      ref="containerRef"
      style="width: calc(100% - 30px)"
      class="h-full relative flex flex-col text-center justify-evenly self-center justify-self-center box-border border-dashed border-2 border-primary-700 hover:bg-surface-100"
      @mouseenter="$emit('dropzone-enter')"
      @mouseleave="$emit('dropzone-leave')"
      @dragenter.prevent="dragenter"
      @dragleave="dragleave"
      @drop.prevent="drop"
    >
      <p class="mt-6 self-center">
        <FontAwesomeIcon icon="upload" class="text-primary-700 h-icon-lg" />
      </p>
      <input ref="inputRef" type="file" title="click or drop file here" accept=".vtt,.srt,.ass,.ssa" class="w-full h-full cursor-pointer absolute z-10 opacity-0" @change="fileSelected" />
      <div v-show="fileErrorMsg" class="absolute top-0 inset-x-0 p-2 flex place-content-center text-center z-30 bg-error text-on-error shadow">
        <div class="self-center rounded-full p-0.5 bg-error-icon mr-2">
          <FontAwesomeIcon icon="times" class="h-icon-sm w-icon-sm text-white" />
        </div>
        <span class="self-center">{{ fileErrorMsg }}</span>
      </div>
      <div class="m-2">
        <p class="m-2">Click or drop file to this area to upload</p>
        <p class="m-2 text-sub-text-on-surface-50 text-sm">
<!--          Support for a single file upload. Only .srt, .ass, .ssa and .vtt file is acceptable. (Video is {{ videoStore.count === 1 ? 'auto' : '' }} selected)-->
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import { readFile } from './readFile';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  emits: ['dropzone-enter', 'dropzone-leave', 'load', 'unmount'],
  setup(_props, {emit}) {
    const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

    const containerRef = ref();
    const fileErrorMsg = ref('');
    const dragenter = (): void => containerRef.value.classList.add('bg-surface-200');
    const dragleave = (): void => containerRef.value.classList.remove('bg-surface-200');

    onUnmounted(() => emit("unmount"));

    const showFileErrorMsg = (msg: string) => {
      fileErrorMsg.value = msg;
      setTimeout(() => {
        fileErrorMsg.value = '';
      }, 4000);
      dragleave();
    };

    const handleFile = async (file: File) => {
      const filename = file.name;
      if (!filename.match(/\.(srt|vtt|ass|ssa)$/)) {
        showFileErrorMsg('Only .srt, .ass, .ssa and .vtt file is acceptable');
        return;
      }
      try {
        emit("load", await readFile(file))
      } catch(e) {
        showFileErrorMsg('Some error happened when parsing the subtitle')
      }
    };

    return {
      inputRef,
      containerRef,
      fileErrorMsg,
      dragenter,
      dragleave,

      drop: async (event: DragEvent): Promise<void> => {
        const droppedFiles = event.dataTransfer?.files;
        if (!droppedFiles) {
          showFileErrorMsg('Drop to upload file error');
          return;
        }
        if (droppedFiles.length > 1) {
          showFileErrorMsg('Only a single file is supported');
          return;
        }
        await handleFile(droppedFiles[0]);

      },
      fileSelected: async (): Promise<void> => {
        if (!inputRef.value?.files) {
          showFileErrorMsg('Click to upload file error');
          return;
        }
        await handleFile(inputRef.value.files[0]);
      }
    };
  }
});
</script>
