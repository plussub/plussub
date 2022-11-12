<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar has-back></Toolbar>
    </template>
    <template #content>
      <div class="w-full h-full grid relative justify-center transcript-content--container">
        <div style="grid-area: bar; grid-template-columns: 1fr auto;" class="pt-3 pb-2 bg-primary-50 grid gap-4">
          <div class='leading-normal pl-4 text-sm italic'>
            <div>Control hint</div>
            <div class='pl-2 leading-relaxed'>
              <div>left click - jump to time point </div>
              <div>shift + left click - copy text to clipboard</div>
            </div>
          </div>
          <div class='self-end'>
            <span class="px-4 font-medium">{{ videoStore.currentTimeAs("mm:ss").value }}</span>
          </div>
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
import { useStore as useVideoStore } from '@/video/store';
import { useStore as useTranscriptStore } from '@/transcript/store';

export default defineComponent({
  components: {
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
