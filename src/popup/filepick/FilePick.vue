<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div style="display: flex;">
        <toolbar-back-btn style="height: 100%;" />
        <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px;">
          Pick a file
        </div>
      </div>
    </template>
    <template #content>
      <div class="filepicker-content--container">
        <div class="filepicker-content--container--card" style="grid-area: filepicker;">
          <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
            Pick a .srt/.vtt file
          </div>
          <input style="grid-area: card-content;" type="file" @change="fileSelected" ref="fileInput" accept="text/plain" />
        </div>
        <div style="grid-area: spacer;">&nbsp;</div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import ToolbarBackBtn from '@/components/ToolbarBackBtn.vue';
import PageLayout from '@/components/PageLayout';
import { setSelection } from '@/filepick/setSelection';
import { parseInBackground } from './parseInBackground';
import { snapshot } from '@/../shared/appState';

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
  setup() {
    return {
      fileSelected() {
        const reader = new FileReader();
        reader.readAsText(this.$refs['fileInput'].files[0]);
        reader.onload = () => {
          const filename = this.$refs['fileInput'].files[0].name;
          setSelection({ filename, rawSrt: reader.result, appState: snapshot() });
          parseInBackground();
          this.$router.replace({ name: 'home' });
        };
      }
    };
  }
};
</script>
<style scoped>
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
