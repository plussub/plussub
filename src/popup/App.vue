<template>
  <KnopfCss />
  <div v-if="navigationState.name === 'SEARCH'" class="app--container">
    <Search v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'SUBTITLE-SELECTION'" class="app--container">
    <SubtitleSelection v-bind="navigationState.params" />
  </div>
  <div v-else-if="navigationState.name === 'TRANSCRIPT'" class="app--container">
    <Transcript v-bind="navigationState.params" />
  </div>
  <div v-else class="app--container">
    <Home v-bind="navigationState.params" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { init as initAppState } from '@/app/state';
import { init as initVideoState } from '@/video/state';
import { init as initFileState } from '@/file/state';
import { init as initSubtitleState } from '@/subtitle/state';
import { init as initSubtitleSearchState } from '@/search/state';
import { init as initNavigationState, setupAutoNavigation, navigationState } from '@/navigation/state';

import { default as KnopfCss } from '@/KnopfCss.vue';
import { default as Home } from '@/home/pages/Home.vue';
import { default as Search } from '@/search/pages/search/Search.vue';
import { default as SubtitleSelection } from '@/search/pages/subtitleSelection/SubtitleSelection.vue';
import { default as FilePick } from '@/file/components/FilePick.vue';
import { default as Transcript } from '@/transcript/pages/Transcript.vue';

export default defineComponent({
  components: {
    KnopfCss,
    Home,
    Search,
    SubtitleSelection,
    FilePick,
    Transcript
  },
  setup(){
    initAppState();
    initNavigationState();
    initSubtitleState();
    initVideoState();
    initFileState();
    initSubtitleSearchState();
    setupAutoNavigation();
    return {
      navigationState
    }
  }
});
</script>

<style>

:host {
  --primary: #5bc0de;
  --primary50: #e4f7fd;
  --onPrimary: #ffffff;
  --on-surface: var(--default-text-color);
  --secondary: #b0bec5;
  --accent: #8c9eff;
  --error: #b71c1c;
  --debug: #b710af;
  --background-color: white;
  --surface-color: white;
  --default-text-color: #989898;
  --default-header-text-color: #000000;
  --hoverColorOnSurfce: #def2f8;

  --toolbar-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --toolbar-height: 40px;
  --icon-size: 24px;
  --icon-size-sm: 12px;
  --content-lr-space: 8px;

  --card-padding-top: 16px;
  --card-header-font-size: 27px;
  --card-sub-header-font-size: 20px;
  --card-actions-background-color: var(--surface-color);
  --card-header-font-family: 'Rubik', sans-serif;
  --card-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
  --card-lr-space: 16px;
  --card-border-radius: 4px;

  --knopf-hue: 194 !important;
  --knopf-saturation: 66.5% !important;
  --knopf-luminosity: 61.4% !important;
  --knopf-font-size-base: 16px !important;
}

:host .buttonOnPrimary {
  --knopf-text-color: --onPrimary;
  --knopf-hue: 0;
  --knopf-saturation: 0%;
  --knopf-luminosity: 100%;
}

:host .knopf.flat.buttonOnSurface {
  --knopf-text-color: --onSurface;
  --knopf-hue: 0;
  --knopf-saturation: 0%;
  --knopf-luminosity: 100%;
}

/* use all:initial to prevent inheritance from body */
:host {
  all: initial;
}
</style>
<style scoped>

.content-navigate-deeper-leave-active,
.content-navigate-deeper-enter-active {
  transition: all 0.2s ease;
}

.content-navigate-deeper-enter-from {
  transform: translate(100%, 0);
}

.content-navigate-deeper-leave-to {
  transform: translate(-100%, 0);
}

.content-navigate-select-to-home-enter-active {
  opacity: 1;
  transition: all 0.1s ease;
}

.content-navigate-select-to-home-leave-active {
  transition: all 0.1s ease;
}

.content-navigate-select-to-home-enter-from,
.content-navigate-select-to-home-leave-to {
  transform: scale3d(1.3, 1.3, 1.3);
  opacity: 0;
}

.content-navigate-shallow-leave-active,
.content-navigate-shallow-enter-active {
  transition: all 0.2s ease;
}

.content-navigate-shallow-enter-from {
  transform: translate(-100%, 0);
}

.content-navigate-shallow-leave-to {
  transform: translate(100%, 0);
}

.toolbar-transition-enter-active,
.toolbar-transition-leave-active {
  transition: all 0.2s ease;
}

.toolbar-transition-enter-from {
  opacity: 0;
}

.toolbar-transition-leave-to {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-more-enter-active {
  transition: all 0.3s linear;
  transform: rotate(180deg);
}

.menu-less-enter-active {
  transition: all 0.3s linear;
  transform: rotate(-180deg);
}

.menu-more-leave-active,
.menu-less-leave-active {
  display: none;
}

.menu-more-enter-to,
.menu-less-enter-to {
  transform: rotate(0deg);
}

.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}

.app--container {
  background-color: red;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: var(--default-text-color);
  /*background-color: var(--background-color);*/

  max-width: 400px;
  width: 400px;
  max-height: 720px;
  min-height: 400px;
  height: auto;
  overflow-x: hidden;
  overflow-y: hidden;
  display: grid;
  grid-template-areas:
    'toolbar'
    'content';
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}
</style>
