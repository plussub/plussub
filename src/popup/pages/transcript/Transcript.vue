<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <ToolbarBackBtn style="height: 100%" @navigate="(event) => $emit('navigate', event)" />
        <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Transcript</div>
      </div>
    </template>
    <template #content>
      <div id="transcript-content--container" ref="transcriptContentContainer">
        <div v-for="(subtitleText, index) in subtitleTexts" :key="index" class="transcript-content" :class="{ selected: currentPos === index }">
          <span class="transcript-timefrom" v-text="subtitleText.timeFrom"></span>
          <span
            class="transcript-text"
            :class="{ hovering: textHoverIndex === index && (videoEl || videoInFrameHasSub) }"
            @mouseenter="textHoverIndex = index"
            @mouseleave="textHoverIndex = -1"
            @click="setCurrentTime(index)"
            v-text="subtitleText.text"
          ></span>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import {StartTranscript, useDraggableArea, useWindowMessage, useTimeUpdate} from '@/composables';
import {snapshot} from '@/appState';
import {ref, computed, watch} from 'vue';
import {formatTime} from '../../util/time';

export {default as ToolbarBackBtn} from '@/components/ToolbarBackBtn.vue';
export {default as PageLayout} from '@/components/PageLayout';

declare const props: {
  videosInIframe: [];
  sourceObj: object;
  contentTransitionName: string; // default : ''
};

export default {
  emits: ['navigate'],
};

export const draggableAreaRef = ref(null);
useDraggableArea({draggableAreaRef});

const currentTime = ref<number>(0);

export const videoEl = document.querySelector<HTMLVideoElement>('video.plussub');
export const videoInFrameHasSub = computed(() => props.videosInIframe.find((videoInIframe) => videoInIframe.hasSubtitle));

if (videoEl) {
  useTimeUpdate({
    video: videoEl,
    fn: (): void => {
      currentTime.value = videoEl.currentTime;
    }
  });
} else if (videoInFrameHasSub.value) {
  props.sourceObj[videoInFrameHasSub.value.src].postMessage({plusSubAction: 'startTranscript'}, videoInFrameHasSub.value.origin);
  useWindowMessage({
    [StartTranscript]: ({data}) => currentTime.value = data.currentTime
  });
}

const binarySearch = (target, arr) => {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const mid = parseInt((start + (end - start) / 2).toString(), 10);
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

export const currentPos = ref(-1);
export const transcriptContentContainer = ref(null);

watch(currentTime, (currentTime) => {
  const value = parseInt(currentTime.toString(), 10);
  const pos = binarySearch(value * 1000, appState.srt.withOffsetParsed);
  if (pos !== -1 && currentPos.value !== pos) {
    currentPos.value = pos;
  } else {
    return;
  }
  if (!transcriptContentContainer.value.matches(':hover')) {
    const topPos = Math.max(currentPos.value - 3, 0);
    const topElement = transcriptContentContainer.value.querySelector(`:nth-child(${topPos + 1})`);
    const topOffsetTop = topElement.offsetTop;
    transcriptContentContainer.value.scrollTop = topOffsetTop;
  }
});

const appState = await snapshot();

export const setCurrentTime = (index) => {
  const data = appState.srt.withOffsetParsed[index].from;
  if (videoEl) {
    videoEl.currentTime = data / 1000;
  } else if (videoInFrameHasSub.value) {
    props.sourceObj[videoInFrameHasSub.value.src].postMessage(
        {
          plusSubAction: 'setCurrentTime',
          data
        },
        videoInFrameHasSub.value.origin
    );
  }
};

export const textHoverIndex = ref(-1);
export const subtitleTexts = computed(() =>
    appState.srt.withOffsetParsed.map(({from, text}) => ({
      timeFrom: formatTime({time: from, largestUnit: 'MINUTE', smallestUnit: 'SECOND'}),
      text
    }))
);
</script>
<style scoped>
/* plussub header */
#transcript-content--container {
  color: #030303;
  height: 100%;
  position: relative;
  background-color: #f9f9f9;
  overflow: scroll;
}

.transcript-content {
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

.transcript-text.hovering {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
