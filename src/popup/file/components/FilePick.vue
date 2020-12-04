<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <div v-show="getVideoName() !== ''" style="padding-left: 8px">
      <div>Suggested Search</div>
      <div class="video-name-string" style="margin-top: 8px" @click="changeQuery">{{ getVideoName() }}</div>
    </div>
    <div
      ref="containerRef"
      class="filepicker-content--container"
      @mouseenter="enterVideo(srcToGlobalVideo[currentSelectedVideoSrc])"
      @mouseleave="leaveVideo"
      @dragenter.prevent="dragenter"
      @dragleave="dragleave"
      @drop.prevent="drop"
    >
      <p class="upload-drag-icon">
        <fa icon="upload" />
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
  </div>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, PropType, ref} from 'vue';
import {enterVideo, leaveVideo} from '@/util/hover';
import {getVideoName} from '@/util/name';
import {OnLoadPayload, readFile} from './readFile';

import {default as xCircleIcon} from '@/res/x-circle.svg';
import {srcToGlobalVideo, videoCount, videosWithSubtitle} from '@/video/state';
import {setSrc, setState} from "@/app/state";
import {parse, setRaw} from "@/subtitle/state";
import {getFormatFromFilename} from "@/subtitle/util";
import {setFilename} from "@/file/state";
import {currentSelectedVideoSrc, toHome} from "@/navigation/state";

export default defineComponent({
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ""
    },
  },
  emits: ['update:query'],
  setup(props, {emit}) {

    const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

    const containerRef = ref();
    const fileErrorMsg = ref('');
    const dragenter = (): void => containerRef.value.classList.add('dragging-over');
    const dragleave = (): void => containerRef.value.classList.remove('dragging-over');


    onUnmounted(() => leaveVideo());

    const showFileErrorMsg = (msg: string) => {
      fileErrorMsg.value = msg;
      setTimeout(() => {
        fileErrorMsg.value = '';
      }, 2000);
      dragleave();
    };

    const onLoad = ({fileName, result}: OnLoadPayload): void => {
      setFilename({filename: fileName});
      setState({state: 'SELECTED'});
      setSrc({src: 'FILE'});

      setRaw({raw: result, format: getFormatFromFilename(fileName)});
      parse();
      toHome({
        contentTransitionName: 'content-navigate-select-to-home'
      });
    }
    const onError = (): void => showFileErrorMsg('Some error happened when parsing the subtitle');

    return {
      xCircleIcon,
      inputRef,
      containerRef,
      fileErrorMsg,
      dragenter,
      dragleave,
      getVideoName,
      enterVideo,
      leaveVideo,
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
        readFile({file, onLoad, onError});
      },
      fileSelected: async (): Promise<void> => {
        if (!inputRef.value?.files) {
          showFileErrorMsg('Click to upload file error');
          return;
        }
        const file = inputRef.value.files[0];
        readFile({file, onLoad, onError});
      },
      changeQuery: (): void => emit('update:query', getVideoName())
    }
  }
});
</script>

<style scoped>
/* plussub header */
.filepicker-content--container {
  box-sizing: border-box;
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  position: relative;
  padding: 110px 0 110px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-self: center;
  justify-self: center;
  border: 2px dashed;
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
