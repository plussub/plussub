<template>
  <div class="text-sm">
    <div>Window to small?</div>
    <div><a class="text-primary-500 hover:text-primary-700 hover:underline" @click="toTranscript()">Click here</a> to go to the main transcript view</div>
    <div class="mt-2">Left click: Jump to timepoint</div>
    <div>Shift+Left click: Copy text</div>
    <div class="mt-4 flex justify-end">
      <span class="mr-1">Follow</span>
      <input v-model="follow" type="checkbox" class="text-primary-700 focus:ring-0 focus:ring-offset-0" />
    </div>
    <TranscriptContent
      :entries="transcriptStore.entries"
      :follow="follow"
      :position="transcriptStore.currentSubtitlePos"
      class="border rounded max-h-52"
      @copy="transcriptStore.copy"
      @jump="transcriptStore.jump">
      <template #line="{entry}">
        <span class="text-center flex-shrink-0 w-14">{{ transcriptStore.formatTime(entry.from) }}</span>
        <span class="text-left">{{ entry.text }}</span>
      </template>
    </TranscriptContent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TranscriptContent from '@/transcript/components/TranscriptContent.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useTranscriptStore } from '@/transcript/store';

export default defineComponent({
  components: { TranscriptContent },
  setup() {
    const navigationStore = useNavigationStore();
    const transcriptStore = useTranscriptStore();
    return {
      transcriptStore,
      toTranscript: () => navigationStore.to("TRANSCRIPT", {contentTransitionName: "content-navigate-deeper" }),
      follow: ref(true)
    };
  }
});
</script>
