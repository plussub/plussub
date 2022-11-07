<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar has-back>
        <a class="self-center pr-4" :title="[`left click - jump to time point`, `shift + left click - copy text to clipboard`].join('\n')">
          <FontAwesomeIcon icon="question-circle" class="h-icon hover:text-on-primary-hover-500"></FontAwesomeIcon>
        </a>
      </Toolbar>
    </template>
    <template #content>
      <div class="w-full h-full grid relative justify-center transcript-content--container">
        <div style="grid-area: bar" class="pt-3 pb-2 bg-primary-50 flex justify-end">
          <span class="px-4 font-medium">{{ videoStore.currentTimeAs("mm:ss").value }}</span>
        </div>
        <div style="grid-area: loading" class="flex items-end flex-wrap bg-primary-50 shadow-md">
          <LoadingBar class="w-full" />
        </div>

        <TranscriptContent
          :entries="transcriptStore.entries"
          :position="transcriptStore.currentSubtitlePos"
          style="grid-area: entries"
          @copy="transcriptStore.copy"
          @jump="transcriptStore.jump">
          <template #line="{entry}">
            <span class="text-center flex-shrink-0 w-14">{{ transcriptStore.formatTime(entry.from) }}</span>
            <span class="text-left">{{ entry.text }}</span>
          </template>
        </TranscriptContent>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PageLayout from '@/components/PageLayout.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import TranscriptContent from '@/transcript/components/TranscriptContent.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { useStore as useVideoStore } from '@/video/store';
import { useStore as useTranscriptStore } from '@/transcript/store';
export default defineComponent({
  components: {
    FontAwesomeIcon,
    Toolbar,
    PageLayout,
    LoadingBar,
    TranscriptContent
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const videoStore = useVideoStore();
    const transcriptStore = useTranscriptStore();

    return {
      videoStore,
      transcriptStore
    };
  }
});
</script>

<style scoped>
.transcript-content--container {
  min-height: 300px;
  max-height: 500px;
  grid-template-areas:
    'bar'
    'loading'
    'entries';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>
