<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <ToolbarBackBtn style="height: 100%" @navigate="(event) => $emit('navigate', event)"/>
        <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px">Pick a file</div>
      </div>
    </template>
    <template #content>
      <div class="filepicker-content--container">
        <div class="filepicker-content--container--card" style="grid-area: filepicker">
          <div
              style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500">
            Pick a .srt/.vtt file
          </div>
          <input ref="inputRef" style="grid-area: card-content" type="file" accept=".vtt,.srt" @change="fileSelected"/>
        </div>
        <div style="grid-area: spacer">&nbsp;</div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup="props, { emit }" lang="ts">

import {setSelection} from '@/filepick/setSelection';
import {useDraggableArea} from '@/composables';
import {parse} from '@/parse';
import {ref} from 'vue';

export {default as ToolbarBackBtn} from '@/components/ToolbarBackBtn.vue'
export {default as PageLayout} from '@/components/PageLayout';

declare const props: {
  contentTransitionName: string;
}

export default {
  emits: ['navigate']
};

export const draggableAreaRef = ref(null);
useDraggableArea({draggableAreaRef});

export const inputRef = ref<{ files: { name: string } | Blob[] } | null>(null);

export const fileSelected = async (): Promise<void> => {
  const reader = new FileReader();
  reader.onload = async () => {
    if(!inputRef.value?.files){
      return;
    }
    const filename = inputRef.value.files[0].name;
    // as string because we use readAsText...
    await setSelection({filename, rawSrt: reader.result as string});
    parse();
    emit('navigate', {name: 'HOME', params: {contentTransitionName: 'content-navigate-select-to-home'}});
  };
  reader.readAsText(inputRef.value?.files[0] as Blob);
};
</script>

<style scoped>
/* plussub header */
.filepicker-content--container {
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. filepicker .'
    '. spacer .';
  grid-template-rows: auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}

.filepicker-content--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-border-radius);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: auto 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
</style>
