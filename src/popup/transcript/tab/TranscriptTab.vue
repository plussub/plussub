<template>
  <div>
    <div class='p-6 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
      <div class='grid gap-4' style='grid-template-columns: auto 1fr auto auto'>
        <h1 class='mb-2 text-2xl font-bold tracking-tight'>Transcript</h1>
        <PrefixIconButton
          icon-type='fas'
          icon='window-maximize'
          icon-size='large'
          style='grid-column: 3'
          @click='toTranscript'
         >
        </PrefixIconButton>
        <ToggleMenuButton v-model='toggleMenu' style='grid-column: 4' />

      </div>
      <ToggleMenu v-show='toggleMenu'>
        <li>
          <ToggleMenuSelectEntry v-model='follow' @update:model-value='toggleMenu = false'>
            <span>Follow</span>
          </ToggleMenuSelectEntry>
        </li>
      </ToggleMenu>
      <div class='leading-normal mt-2 pl-4 text-sm italic'>
        <div>Control hint</div>
        <div class='pl-2 leading-relaxed'>
          <div>left click - jump to time point</div>
          <div>shift + left click - copy text to clipboard</div>
        </div>
      </div>
      <TranscriptContent
        :entries='transcriptStore.entries'
        :follow='follow'
        :position='transcriptStore.currentSubtitlePos'
        class='border rounded max-h-52 mt-4'
        @copy='transcriptStore.copy'
        @jump='transcriptStore.jump'>
        <template #line='{entry}'>
          <span class='text-center flex-shrink-0 w-14'>{{ transcriptStore.formatTime(entry.from) }}</span>
          <span class='text-left'>{{ entry.text }}</span>
        </template>
      </TranscriptContent>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import TranscriptContent from '@/transcript/components/TranscriptContent.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useTranscriptStore } from '@/transcript/store';
import ToggleMenuButton from '@/components/ToggleMenuButton.vue';
import ToggleMenu from '@/components/ToggleMenu.vue';
import ToggleMenuSelectEntry from '@/components/ToggleMenuSelectEntry.vue';
import PrefixIconButton from '@/components/PrefixIconButton.vue';

export default defineComponent({
  components: {
    PrefixIconButton,
    ToggleMenuSelectEntry,
    ToggleMenu,
    TranscriptContent,
    ToggleMenuButton
  },
  setup() {
    const navigationStore = useNavigationStore();
    const transcriptStore = useTranscriptStore();

    return {
      transcriptStore,
      toggleMenu: ref(false),
      toTranscript: () => navigationStore.to('TRANSCRIPT', { contentTransitionName: 'content-navigate-deeper' }),
      follow: ref(true)
    };
  }
});
</script>
