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
    <TranscriptContent :follow="follow" class="border rounded max-h-52"></TranscriptContent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useInjectStore } from '@/useInjectStore';
import TranscriptContent from '@/subtitle/components/TranscriptContent.vue';

export default defineComponent({
  components: { TranscriptContent },
  setup() {
    const navigationStore = useInjectStore('navigationStore');
    return {
      toTranscript: navigationStore.actions.toTranscript,
      follow: ref(true)
    };
  }
});
</script>
