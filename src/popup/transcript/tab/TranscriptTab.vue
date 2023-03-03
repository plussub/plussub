<template>
  <div>
    <div class='flex' style='display: var(--transcript-control-hint)'>
      <div class='leading-normal mt-2 pl-4 text-sm italic flex-grow'>
        <div>Control hint</div>
        <div class='pl-2 leading-relaxed'>
          <div>left click - jump to time point</div>
          <div>shift + left click - copy text to clipboard</div>
        </div>
      </div>
      <ToggleMenuButton class='pr-2 pt-2' v-model='toggleMenu' />
      <ToggleMenu v-show='toggleMenu'>
        <li>
          <ToggleMenuSelectEntry v-model='follow' @update:model-value='toggleMenu = false'>
            <span>Follow</span>
          </ToggleMenuSelectEntry>
        </li>
      </ToggleMenu>
    </div>
    <Divider class="w-full bottom-0 border-surface-200" style='display: var(--transcript-control-hint)'></Divider>
    <TranscriptContent
        :entries='transcriptStore.entries'
        :follow='follow'
        :position='transcriptStore.currentSubtitlePos'
        style='max-height: var(--transcript-content-max-height)'
        @copy='transcriptStore.copy'
        @jump='transcriptStore.jump'>
        <template #line='{entry}'>
          <span class='text-center flex-shrink-0 w-14'>{{ transcriptStore.formatTime(entry.from) }}</span>
          <span class='text-left'>{{ entry.text }}</span>
        </template>
      </TranscriptContent>
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
import Divider from '@/components/Divider.vue';

export default defineComponent({
  components: {
    ToggleMenuSelectEntry,
    ToggleMenu,
    TranscriptContent,
    ToggleMenuButton,
    Divider
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

<style>
:host{
  --transcript-control-hint: block;
  --transcript-content-max-height: 250px
}
@media (max-width:600px)  {
  :host {
    --transcript-control-hint: none;
    --transcript-content-max-height: 140px
  }
}

</style>
