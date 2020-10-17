<template>
  <div id="filepicker-content--container" @mouseenter="enterVideo(videoWithSubtitle)" @mouseleave="leaveVideo" @dragenter.prevent="dragenter" @dragleave="dragleave" @drop.prevent="drop">
    <p class="upload-drag-icon">
      <i class="fa fa-upload fa-lg"></i>
    </p>
    <input
      ref="inputRef"
      type="file"
      title="click or drop file here"
      accept=".vtt,.srt"
      style="z-index: 1; opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer"
      @change="fileSelected"
    />
    <div v-show="fileErrorMsg" id="file-error-notification">
      <img :src="xCircleIcon" alt="(Error)" style="display: inline; margin-right: 5px; width: 14px" />
      {{ fileErrorMsg }}
    </div>
    <div style="margin: 0 40px 0 40px">
      <p class="upload-text">Click or drop file to this area to upload</p>
      <p class="upload-hint">
        Support for a single file upload. Only .srt or .vtt file is acceptable.(Video
        <span :class="{ 'video-name-string': isNameNotNum }" @click="changeQuery">{{ videoName }}</span> is {{ videoNum === 1 ? 'auto' : '' }} selected)
      </p>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { setFilename } from '../state';
import { setState, setSrc } from '@/app/state';
import { setRaw, parse } from '@/subtitle/state';
import { srcToVideo } from '@/video/state';
export { enterVideo, leaveVideo } from '@/util/hover';
export { default as xCircleIcon } from '@/res/x-circle.svg';

declare const props: {
  videoName: string;
  query: string;
};

export default {
  emits: ['navigate']
};

export const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

const readFile = (file: any): void => {
  const reader = new FileReader();
  reader.onload = async () => {
    setFilename({ filename: file.name });
    setState({ state: 'SELECTED' });
    setSrc({ src: 'FILE' });
    // as string because we use readAsText...
    setRaw({ raw: reader.result as string });
    parse();

    emit('navigate', { name: 'HOME', params: { contentTransitionName: 'content-navigate-select-to-home' } });
  };
  reader.readAsText(file);
};
export const fileErrorMsg = ref('');
const SHOW_MESSAGE_TIME = 2000;
// or use watch
const resetFileErrorMsg = (timeout: number) => {
  setTimeout(() => {
    fileErrorMsg.value = '';
  }, timeout);
};
export const fileSelected = async (): Promise<void> => {
  if (!inputRef.value?.files) {
    fileErrorMsg.value = 'Click to upload file error';
    resetFileErrorMsg(SHOW_MESSAGE_TIME);
    return;
  }
  const file = inputRef.value.files[0];
  readFile(file);
};
export const dragenter = (event): void => {
  event.currentTarget.classList.add('dragging-over');
};
export const dragleave = (event): void => {
  event.currentTarget.classList.remove('dragging-over');
};
export const drop = (event): void => {
  let droppedFiles = event.dataTransfer?.files;
  if (!droppedFiles && !droppedFiles.length) {
    fileErrorMsg.value = 'Drop to upload file error';
    dragleave(event);
    resetFileErrorMsg(SHOW_MESSAGE_TIME);
    return;
  }
  const file = droppedFiles[0];
  const filename = file.name;
  if (!filename.endsWith('.srt') && !filename.endsWith('.vtt')) {
    fileErrorMsg.value = 'Only .srt or .vtt file is acceptable.';
    dragleave(event);
    resetFileErrorMsg(SHOW_MESSAGE_TIME);
    return;
  }
  readFile(file);
};
const nameToInt = parseInt(props.videoName, 10);
export const isNameNotNum = isNaN(nameToInt) || nameToInt > 20;
export const changeQuery = (): void => {
  if (!isNameNotNum) return;
  emit('update:query', props.videoName);
};
export const videoWithSubtitle = computed(() => Object.values(srcToVideo.value).filter((e) => e.hasSubtitle)[0]);
export const videoNum = computed(() => Object.values(srcToVideo.value).length);
onUnmounted(() => {
  leaveVideo();
});
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
  margin: 0;
}
.upload-text {
  margin: 0 0 4px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}
.upload-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin: 0;
}
.dragging-over {
  background-color: #9ae6b4;
}
.video-name-string {
  z-index: 2;
  position: relative;
  color: #0366d6;
  text-decoration: underline;
  cursor: pointer;
}
#file-error-notification {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  background: #fff1f0;
  text-align: center;
  box-shadow: 0 0 5px black;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.65);
  font-size: 15px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  padding: 8px 15px 8px 37px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
