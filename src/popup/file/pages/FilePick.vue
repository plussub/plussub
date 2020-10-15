<template>
  <div id="filepicker-content--container" ref="filepickerContainer" @dragenter.prevent="dragenter" @dragleave="dragleave" @drop.prevent="drop">
    <input ref="inputRef" type="file" accept=".vtt,.srt" style="z-index: 1; opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer" @change="fileSelected" />
    <p class="upload-drag-icon">
      <i class="fa fa-upload fa-lg"></i>
    </p>
    <div style="margin: 0 40px 0 40px">
      <p class="upload-text">Click or drag file to this area to upload</p>
      <p class="upload-hint">Support for a single file upload. Only .srt or .vtt file is acceptable.</p>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { ref } from 'vue';
import { setFilename } from '../state';
import { setState, setSrc } from '@/app/state';
import { setRaw, parse } from '@/subtitle/state';

export default {
  emits: ['navigate']
};

export const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

export const fileSelected = async (): Promise<void> => {
  if (!inputRef.value?.files) {
    return;
  }
  const filename = inputRef.value.files[0].name;

  const reader = new FileReader();
  reader.onload = async () => {
    if (!inputRef.value?.files) {
      return;
    }

    setFilename({ filename: inputRef.value.files[0].name });
    setState({ state: 'SELECTED' });
    setSrc({ src: 'FILE' });
    // as string because we use readAsText...
    setRaw({ raw: reader.result as string });
    parse();

    emit('navigate', { name: 'HOME', params: { contentTransitionName: 'content-navigate-select-to-home' } });
  };
  reader.readAsText(inputRef.value?.files[0] as Blob);
};

// return should be alert
export const drop = (event): void => {
  let droppedFiles = event.dataTransfer?.files;
  if (!droppedFiles && !droppedFiles.length) return;
  if (droppedFiles.length !== 1) return;
  const file = droppedFiles[0];
  const filename = file.name;
  if (!filename.endsWith('.srt') && !filename.endsWith('.vtt')) return;

  const reader = new FileReader();
  reader.onload = async () => {
    setFilename({ filename });
    setState({ state: 'SELECTED' });
    setSrc({ src: 'FILE' });
    // as string because we use readAsText...
    setRaw({ raw: reader.result as string });
    parse();
    parse();
    emit('navigate', { name: 'HOME', params: { contentTransitionName: 'content-navigate-select-to-home' } });
  };
  reader.readAsText(file as Blob);
};
export const filepickerContainer = ref(null);
export const dragenter = (event): void => {
  event.currentTarget.classList.add('dragging-over');
};
export const dragleave = (event): void => {
  event.currentTarget.classList.remove('dragging-over');
};
export const onClick = (): void => {
  emit('navigate', {
    name: 'SEARCH',
    params: { contentTransitionName: 'content-navigate-shallow' }
  });
};
</script>

<style scoped>
/* plussub header */
#filepicker-content--container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 110px 0 110px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.upload-drag-icon {
  color: #5bc0de;
  font-size: 24px;
}
.upload-text {
  margin: 0 0 4px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}
.upload-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.dragging-over {
  background-color: #9ae6b4;
}
</style>
