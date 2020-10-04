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
          <span class="transcript-timefrom" v-text="subtitleText.timeFrom"></span>
          <span class="transcript-text" @click="setCurrentTime(index)" v-text="subtitleText.text"></span>
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
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    },
    videosInIframe: Array
  },
  emits: ['navigate'],
  async setup(props) {
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    const currentTime = ref(0);
    const getTimeStamp = (time) => {
      const value = parseInt(time, 10);
      const seconds = Math.trunc((value / 1000) % 60);
      const minutes = Math.trunc((value / (1000 * 60)) % 1000);
      return `${minutes > 9 ? '' : '0'}${minutes}:${seconds > 9 ? '' : '0'}${seconds}`;
    };

    const videoEl = document.querySelector('video.plussub');
    // let videoInFrameSrc = '';
    const videoInFrameSrc = computed(() => {
      const videoInFrameIdx = props.videosInIframe.findIndex((videoInIframe) => videoInIframe.hasSubtitle);
      if (videoInFrameIdx !== -1) {
        return props.videosInIframe[videoInFrameIdx].src;
      }
    });
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
    } else if (videoInFrameSrc.value) {
      const iframe = document.querySelector(`iframe[src="${videoInFrameSrc.value}"]`);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ plusSubAction: 'startTranscript' }, '*');
        window.addEventListener('message', handleCurrentTimeMessage);
      }
    }

    onUnmounted(() => {
      if (videoEl) {
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      } else if (videoInFrameSrc.value) {
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

    watch(currentTime, (currentTime) => {
      const value = parseInt(currentTime, 10);
      const pos = binarySearch(value * 1000, appState.srt.parsed);
      if (pos !== -1 && currentPos.value !== pos) {
        currentPos.value = pos;
      }
      let lastTopPos = -1;
      if (!transcriptContentContainer.value.matches(':hover')) {
        const topPos = Math.max(currentPos.value - 3, 0);
        if (lastTopPos === topPos) return;
        lastTopPos = topPos;
        const topElement = transcriptContentContainer.value.querySelector(`:nth-child(${topPos + 1})`);
        const topOffsetTop = topElement.offsetTop;
        transcriptContentContainer.value.scrollTop = topOffsetTop;
      }
    });

    const appState = await snapshot();

    const setCurrentTime = (index) => {
      const data = appState.srt.parsed[index].from;
      if (videoEl) {
        videoEl.currentTime = data / 1000;
      } else if (videoInFrameSrc.value) {
        const iframe = document.querySelector(`iframe[src="${videoInFrameSrc.value}"]`);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ plusSubAction: 'setCurrentTime', data }, '*');
        }
      }
    };

    return {
      draggableAreaRef,
      currentPos,
      transcriptContentContainer,
      setCurrentTime,
      subtitleTexts: computed(() => {
        return appState.srt.parsed.map(({ from, text }) => ({
          timeFrom: getTimeStamp(from),
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
}
.transcript-content.selected {
  background-color: rgba(0, 0, 0, 0.05);
  border-left: 3px solid #065fd4;
}
.transcript-timefrom {
  width: 60px;
  flex-shrink: 0;
  text-align: center;
}
.transcript-timefrom:hover {
  color: #065fd4;
}
.transcript-text {
  text-align: left;
}
.transcript-text:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
