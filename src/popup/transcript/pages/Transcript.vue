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
        <div v-for="(subtitleText, index) in subtitleTexts" :key="index" class="transcript-content" :class="{ selected: currentPos === index }" @click="setCurrentTime(subtitleText)">
          <span class="transcript-timefrom" v-text="subtitleText.formattedFrom"></span>
          <span
              class="transcript-text"
              :class="{ hovering: textHoverIndex === index && video }"
              @mouseenter="textHoverIndex = index"
              @mouseleave="textHoverIndex = -1"
              v-text="subtitleText.text"
          ></span>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { useDraggableArea } from '@/composables';
import { ref, computed, watch } from 'vue';
import { formatTime } from '../../util/time';
import { srcToVideo, setCurrentTime as setCurrentTimeState } from '@/video/state';
import { useTimeUpdate } from '@/video/composable';

export { default as ToolbarBackBtn } from '@/components/ToolbarBackBtn.vue';
export { default as PageLayout } from '@/components/PageLayout';

declare const props: {
  contentTransitionName: string; // default : ''
};

export default {
  emits: ['navigate']
};

export const draggableAreaRef = ref(null);
useDraggableArea({ draggableAreaRef });

const currentTime = ref<number>(0);

export const video = computed(() => Object.values(srcToVideo.value).find((e) => e.hasSubtitle));

if (video.value) {
  useTimeUpdate({
    video: video.value,
    fn: ({ currentTime: currentTimeFromVideo }): void => {
      currentTime.value = currentTimeFromVideo;
    }
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
export const transcriptContentContainer = ref<HTMLElement | null>(null);

watch(currentTime, (currentTime) => {
  const value = parseInt(currentTime.toString(), 10);
  // replace with hashmap
  const pos = binarySearch(value * 1000, window.plusSub_subtitle.value.withOffsetParsed);
  if (pos !== -1 && currentPos.value !== pos) {
    currentPos.value = pos;
  } else {
    return;
  }
  if (transcriptContentContainer.value && !transcriptContentContainer.value.matches(':hover')) {
    const topPos = Math.max(currentPos.value - 3, 0);
    const topElement = transcriptContentContainer.value.querySelector<HTMLElement>(`:nth-child(${topPos + 1})`);
    if (!topElement) {
      return;
    }
    transcriptContentContainer.value.scrollTop = topElement.offsetTop;
  }
});

export const subtitleTexts = computed(() =>
    window.plusSub_subtitle.value.withOffsetParsed.map(({ from, text }) => ({
    formattedFrom: formatTime({ time: from, largestUnit: 'MINUTE', smallestUnit: 'SECOND' }),
    text,
    time: from / 1000
  }))
);

export const setCurrentTime = ({ time }: {time: number}): void => {
  if (!video.value) {
    return;
  }
  setCurrentTimeState({
    video: video.value,
    time
  });
};
export const textHoverIndex = ref(-1);

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
