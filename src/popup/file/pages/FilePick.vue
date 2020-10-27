<template>
  <div
    id="filepicker-content--container"
    ref="containerRef"
    @mouseenter="enterVideo(srcToGlobalVideo[currentSelectedVideoSrc])"
    @mouseleave="leaveVideo"
    @dragenter.prevent="dragenter"
    @dragleave="dragleave"
    @drop.prevent="drop"
  >
    <p class="upload-drag-icon">
      <i class="fa fa-upload fa-lg"></i>
    </p>
    <input
      ref="inputRef"
      type="file"
      title="click or drop file here"
      accept=".vtt,.srt,.ass,.ssa"
      style="z-index: 1; opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer"
      @change="fileSelected"
    />
    <div v-show="fileErrorMsg" id="file-error-notification">
      <img :src="xCircleIcon" alt="(Error)" style="display: inline; margin-right: 5px; width: 14px" />
      {{ fileErrorMsg }}
    </div>
    <div style="margin: 0 40px 0 40px">
      <!--      font-size: 0.85em; line-height: 1.8; font-weight: 300 -->
      <p class="upload-text">Click or drop file to this area to upload</p>
      <p class="upload-hint">
        Support for a single file upload. Only .srt, .ass, .ssa and .vtt file is acceptable.(Video
        <span :class="{ 'video-name-string': getVideoName() !== '1' }" @click="changeQuery">{{ getVideoName() }}</span>
        is {{ videoCount === 1 ? 'auto' : '' }} selected)
      </p>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import {onUnmounted, ref} from 'vue';
import {setFilename} from '../state';
import {setSrc, setState} from '@/app/state';
import {parse, setRaw} from '@/subtitle/state';
import {leaveVideo} from '@/util/hover';
import {getVideoName} from '@/util/name';
import {toHome} from '../../navigation/state/actions';
import chardet from 'chardet';
import {getFormatFromFilename} from "../../subtitle/util/getFormatFromFilename";

export {currentSelectedVideoSrc} from '@/navigation/state/state';
export {srcToGlobalVideo} from '@/video/state/state';

export {default as xCircleIcon} from '@/res/x-circle.svg';
export {videosWithSubtitle, videoCount} from '@/video/state';
export {enterVideo} from '@/util/hover';
export {getVideoName};
export {leaveVideo};

declare const props: {
  query: string;
};

export default {
  emits: ['update:query']
};

export const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

export const containerRef = ref();
export const fileErrorMsg = ref('');
export const dragenter = (): void => containerRef.value.classList.add('dragging-over');
export const dragleave = (): void => containerRef.value.classList.remove('dragging-over');
const showFileErrorMsg = (msg: string) => {
  fileErrorMsg.value = msg;
  setTimeout(() => {
    fileErrorMsg.value = '';
  }, 2000);
  dragleave();
};

const readFile = (file: File): void => {
  const arrayBufferReader = new FileReader();
  arrayBufferReader.readAsArrayBuffer(file);
  arrayBufferReader.onload = async () => {
    const encoding = chardet.detect(new Uint8Array(arrayBufferReader.result as ArrayBuffer));
    const textReader = new FileReader();
    textReader.readAsText(file, encoding ?? 'UTF-8');
    textReader.onload = async () => {
      setFilename({filename: file.name});
      setState({state: 'SELECTED'});
      setSrc({src: 'FILE'});
      // as string because we use readAsText...

      setRaw({raw: textReader.result as string, format: getFormatFromFilename(file.name)});
      parse();
      toHome({
        contentTransitionName: 'content-navigate-select-to-home'
      });
    };
    textReader.onerror = () => showFileErrorMsg('Some error happened when parsing the subtitle');
  };
  arrayBufferReader.onerror = () => showFileErrorMsg('Some error happened when parsing the subtitle');
};
export const drop = (event: DragEvent): void => {
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
  readFile(file);
};

export const fileSelected = async (): Promise<void> => {
  if (!inputRef.value?.files) {
    showFileErrorMsg('Click to upload file error');
    return;
  }
  const file = inputRef.value.files[0];
  readFile(file);
};

export const changeQuery = (): void => emit('update:query', getVideoName());

onUnmounted(() => leaveVideo());
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
