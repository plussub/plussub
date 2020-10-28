<template>
  <PageLayout :content-transition-name="contentTransitionName" has-back>
    <template #toolbar>
      <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Transcript</div>
    </template>
    <template #content>
      <div id="transcript-content--container" ref="transcriptContentContainer">
        <div v-for="(subtitleText, index) in subtitleTexts" :key="index" class="transcript-content" :class="{ selected: currentPos === index }" @click="setCurrentTime(subtitleText)">
          <span class="transcript-timefrom" v-text="subtitleText.formattedFrom"></span>
          <span class="transcript-text" v-text="subtitleText.text"></span>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">
import { ref, computed, watch } from 'vue';
import { formatBiggestUnitMinuteSmallestUnitSeconds } from '../../util/time';
import { videoList, setCurrentTime as setCurrentTimeState } from '@/video/state';
import { useTimeUpdate } from '@/video/composable';
import { subtitleState } from '@/subtitle/state';

export { default as PageLayout } from '@/components/PageLayout';

declare const props: {
  contentTransitionName?: string; // default : ''
};

const currentTime = ref<number>(0);

export const video = computed(() => videoList.value.find((e) => e.hasSubtitle));

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
  const pos = binarySearch(Math.ceil(currentTime * 1000), subtitleState.value.withOffsetParsed);
  if (pos === -1) return;
  currentPos.value = pos;
  if (transcriptContentContainer.value && !transcriptContentContainer.value.matches(':hover')) {
    const topPos = Math.max(currentPos.value - 3, 0);
    const topElement = transcriptContentContainer.value.querySelector<HTMLElement>(`:nth-child(${topPos + 1})`);
    if (!topElement) return;
    transcriptContentContainer.value.scrollTop = topElement.offsetTop;
  }
});

export const subtitleTexts = computed(() =>
  subtitleState.value.withOffsetParsed.map(({ from, text }) => ({
    formattedFrom: formatBiggestUnitMinuteSmallestUnitSeconds({ time: from }),
    text,
    time: from / 1000
  }))
);

export const setCurrentTime = ({ time }: { time: number }): void => {
  if (!video.value) {
    return;
  }
  // +0.001 because the "from" is often the same as previous "to", use this to advoid showing previous subtitle text
  setCurrentTimeState({
    video: video.value,
    time: time + 0.001
  });
};
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
  white-space: pre-line;
}

.transcript-text:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
