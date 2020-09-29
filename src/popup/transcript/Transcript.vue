<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <toolbar-back-btn style="height: 100%" @navigate="(event) => $emit('navigate', event)" />
        <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Transcript</div>
      </div>
    </template>
    <template #content>
      <!-- <textarea readonly style="grid-area: preview; width: 100%; resize: none; height: 100%; font-size: 0.75em; font-family: Roboto, sans-serif; font-weight: 500" v-model="excerpt"> </textarea> -->
      <div id="transcript-content--container" ref="transcriptContentContainer">
        <div v-for="(subtitleText, index) in subtitleTexts" :key="index" class="transcript-content" :class="{ selected: currentPos === index }">
          <span v-text="subtitleText.timeFrom" class="transcript-timefrom"></span>
          <span v-text="subtitleText.text" class="transcript-text" @click="setCurrentTime(index)"></span>
        </div>
      </div>
      <!-- <div id="button">
      </div> -->
    </template>
  </page-layout>
</template>

<script>
import ToolbarBackBtn from '@/components/ToolbarBackBtn.vue';
import PageLayout from '@/components/PageLayout';
import { useDraggableArea } from '@/composables';
import { snapshot } from '@/appState';
import { ref, computed, onUnmounted, watch } from 'vue';

export default {
  components: {
    ToolbarBackBtn,
    PageLayout
  },
  emits: ['navigate'],
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    },
    videosInIframe: Array
  },
  async setup(props, { emit }) {
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    const currentTime = ref(0);
    const getTimeStamp = ({ time, offset }) => {
      const parsedOffset = parseInt(offset, 10);

      const value = parseInt(time, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
      // const milliseconds = parseInt(String(value).slice(-3), 10);
      const seconds = Math.trunc((value / 1000) % 60);
      const minutes = Math.trunc((value / (1000 * 60)) % 60);
      // const hours = Math.trunc((value / (1000 * 60 * 60)) % 24);
      // return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}:${seconds > 9 ? '' : '0'}${seconds}.${milliseconds > 99 ? '' : '0'}${milliseconds > 9 ? '' : '0'}${milliseconds}`;
      return `${minutes > 9 ? '' : '0'}${minutes}:${seconds > 9 ? '' : '0'}${seconds}`;
    };

    const videoEl = document.querySelector('video.plussub');
    let videoInFrameSrc = '';
    const handleTimeUpdate = () => {
      currentTime.value = videoEl.currentTime;
    };
    const handleCurrentTimeMessage = (e) => {
      const { plusSubAction, data } = e.data;
      if (plusSubAction === 'currentTime') {
        currentTime.value = data;
      }
    };
    if (videoEl) {
      videoEl.addEventListener('timeupdate', handleTimeUpdate);
    } else {
      const videoInFrameIdx = props.videosInIframe.findIndex((videoInIframe) => videoInIframe.hasSubtitle);
      if (videoInFrameIdx !== -1) {
        videoInFrameSrc = props.videosInIframe[videoInFrameIdx].src;
        const iframe = document.querySelector(`iframe[src="${videoInFrameSrc}"]`);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ plusSubAction: 'startTranscript' }, '*');
          window.addEventListener('message', handleCurrentTimeMessage);
        }
      }
    }

    onUnmounted(() => {
      if (videoEl) {
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      } else if (videoInFrameSrc) {
        window.removeEventListener('message', handleCurrentTimeMessage);
      }
    });

    const binarySearch = (target, arr) => {
      let start = 0;
      let end = arr.length - 1;
      while (start <= end) {
        const mid = parseInt(start + (end - start) / 2, 10);
        if (target >= arr[mid].from && target <= arr[mid].to) {
          return mid;
        } else if (target > arr[mid].to) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }
      return -1;
    };

    const currentPos = ref(-1);
    const transcriptContentContainer = ref(null);

    const appState = await snapshot();
    const currentOffsetTime = ref(appState.offsetTime ? appState.offsetTime : '');
    let lastTopPos = -1;

    const setCurrentTime = (index) => {
      const data = appState.srt.parsed[index].from;
      if (videoEl) {
        videoEl.currentTime = data / 1000;
      } else if (videoInFrameSrc) {
        const iframe = document.querySelector(`iframe[src="${videoInFrameSrc}"]`);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ plusSubAction: 'setCurrentTime', data }, '*');
        }
      }
    };

    watch(currentTime, (currentTime) => {
      const parsedOffset = parseInt(currentOffsetTime, 10);
      const value = parseInt(currentTime, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
      const pos = binarySearch(value * 1000, appState.srt.parsed);
      if (pos !== -1 && currentPos !== pos) {
        currentPos.value = pos;
      }
      if (!transcriptContentContainer.value.matches(':hover')) {
        const topPos = Math.max(currentPos.value - 3, 0);
        if (lastTopPos === topPos) return;
        lastTopPos = topPos;
        const topElement = transcriptContentContainer.value.querySelector(`:nth-child(${topPos + 1})`);
        const topOffsetTop = topElement.offsetTop;
        transcriptContentContainer.value.scrollTop = topOffsetTop;
      }
    });

    return {
      draggableAreaRef,
      currentPos,
      transcriptContentContainer,
      setCurrentTime,
      subtitleTexts: computed(() => {
        return appState.srt.parsed.map(({ from, text }) => ({
          timeFrom: getTimeStamp({
            time: from,
            offset: currentOffsetTime.value
          }),
          text
        }));
      })
    };
  }
};
</script>
<style scoped>
/* plussub header */
#transcript-content--container {
  color: #030303;
  height: 100%;
  position: relative;
  overflow: scroll;
  background-color: #f9f9f9;
}
.transcript-content {
  /* padding: 7px 0 7px 0; */
  padding: 8px 16px 8px 3px;
  display: flex;
  text-align: center;
}
.transcript-content.selected {
  background-color: rgba(0, 0, 0, 0.05);
  border-left: 3px solid #065fd4;
}
.transcript-timefrom {
  width: 60px;
  flex-shrink: 0;
}
.transcript-timefrom:hover {
  color: #065fd4;
}
/* .transcript-text {
  margin-right: 10px;
} */
.transcript-text:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
