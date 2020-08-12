<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" style="display: flex; height: 40px">
        <toolbar-back-btn style="height: 100%;" @navigate="(event) => $emit('navigate', event)"/>
        <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px;">
          Pick a file
        </div>
      </div>
    </template>
    <template #content>
      <div class="filepicker-content--container">
        <div class="filepicker-content--container--card" style="grid-area: filepicker;">
          <div
              style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500;">
            Pick a .srt/.vtt file
          </div>
          <input style="grid-area: card-content;" type="file" @change="fileSelected" ref="fileInput"
                 accept="text/plain"/>
        </div>
        <div style="grid-area: spacer;">&nbsp;</div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import ToolbarBackBtn from '@/components/ToolbarBackBtn.vue';
import PageLayout from '@/components/PageLayout';
import {setSelection} from '@/filepick/setSelection';
import {useDraggableArea} from "@/composables";
import {parse} from "@/parse";
import {ref} from "vue";

export default {
  components: {
    ToolbarBackBtn,
    PageLayout
  },
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    const draggableAreaRef = ref(null);
    useDraggableArea({draggableAreaRef})
    return {
      draggableAreaRef,
      fileSelected() {
        const reader = new FileReader();
        reader.readAsText(this.$refs['fileInput'].files[0]);
        reader.onload = async () => {
          const filename = this.$refs['fileInput'].files[0].name;
          await setSelection({filename, rawSrt: reader.result});
          parse();
          emit('navigate', {name: 'HOME', params: {contentTransitionName: 'content-navigate-select-to-home'}});
        };
      }
    };
  }
};
</script>
<style scoped>/* plussub header */
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
