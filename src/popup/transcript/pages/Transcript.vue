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

<script lang="ts">
import {ref, computed, watch, defineComponent, PropType} from 'vue';
import { videoList, setCurrentTime as setCurrentTimeState } from '@/video/state';
import { subtitleState } from '@/subtitle/state';
import Duration from 'luxon/src/duration.js'
import { useTimeUpdate } from '@/video/composable';

import { default as PageLayout } from '@/components/PageLayout.vue';
import {binarySearch} from "@/transcript/pages/binarySearch";

export default defineComponent({
  components: {
    PageLayout
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const currentTime = ref<number>(0);
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));

    if (video.value) {
      useTimeUpdate({
        video: video.value,
        fn: ({ currentTime: currentTimeFromVideo }): void => {
          currentTime.value = currentTimeFromVideo;
        }
      });
    }

    const currentPos = ref(-1);
    const transcriptContentContainer = ref<HTMLElement | null>(null);

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

    return {
      currentPos,
      transcriptContentContainer,
      video,
      subtitleTexts: computed(() =>
          subtitleState.value.withOffsetParsed.map(({ from, text }) => ({
            formattedFrom: Duration.fromMillis(from).toFormat("mm:ss"),
            text,
            time: from / 1000
          }))
      ),
      setCurrentTime: ({ time }: { time: number }): void => {
        if (!video.value) {
          return;
        }
        // +0.001 because the "from" is often the same as previous "to", use this to advoid showing previous subtitle text
        setCurrentTimeState({
          video: video.value,
          time: time + 0.001
        });
      }
    }
  }
});
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
