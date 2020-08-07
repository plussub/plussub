<template>
  <knopf-css/>
  <div v-if="state.selected === 'SEARCH'" class="app--container">
    <Suspense>
      <template #default>
        <search @navigate="navigate" v-bind="state.selectedParams"/>
      </template>
      <template #fallback>
        <div> loading</div>
      </template>
    </Suspense>
  </div>
  <div v-else-if="state.selected === 'SUBTITLE-SELECTION'" class="app--container">
    <Suspense>
      <template #default>
        <subtitle-selection @navigate="navigate" v-bind="state.selectedParams"/>
      </template>
      <template #fallback>
        <div> loading</div>
      </template>
    </Suspense>
  </div>
  <div v-else-if="state.selected === 'FILE-PICK'" class="app--container">
    <Suspense>
      <template #default>
        <file-pick @navigate="navigate" v-bind="state.selectedParams"/>
      </template>
      <template #fallback>
        <div> loading</div>
      </template>
    </Suspense>
  </div>
  <div class="app--container" v-else>
    <Suspense>
      <template #default>
        <home @navigate="navigate" v-bind="state.selectedParams"/>
      </template>
      <template #fallback>
        <div> loading</div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import KnopfCss from '@/./KnopfCss.vue';
import Home from '@/home/Home.vue';
import Search from '@/search/Search.vue';
import SubtitleSelection from '@/subtitleSelection/SubtitleSelection.vue';
import FilePick from '@/filepick/FilePick.vue';
import {reactive} from "@vue/reactivity";

export default {
  components: {
    KnopfCss,
    Home,
    FilePick,
    Search,
    SubtitleSelection
  },
  setup() {
    const state = reactive({selected: 'HOME', selectedParams: {}});
    return {
      state,
      navigate(event) {
        state.selectedParams = event.params;
        state.selected = event.name;
      }
    }
  }
};
</script>

<style>/* plussub header */
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

  --toolbar-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --toolbar-height: 40px;
  --content-lr-space: 8px;

  --card-padding-top: 16px;
  --card-header-font-size: 1.4em;
  --card-header-font-family: 'Rubik', sans-serif;
  --card-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  --card-lr-space: 16px;

  --knopf-hue: 194 !important;
  --knopf-saturation: 66.5% !important;
  --knopf-luminosity: 61.4% !important;
  --knopf-font-size-base: 16px !important;
}

.buttonOnPrimary {
  --knopf-text-color: --onPrimary;
  --knopf-hue: 0;
  --knopf-saturation: 0%;
  --knopf-luminosity: 100%;
}

.content-navigate-deeper-leave-active,
.content-navigate-deeper-enter-active {
  transition: all 0.2s ease;
}

.content-navigate-deeper-enter-from{
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

.toolbar-transition-enter-from{
  opacity: 0;
}
.toolbar-transition-leave-to{
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style scoped>/* plussub header */
.app--container {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: var(--default-text-color);
  background-color: var(--background-color);

  max-width: 400px;
  width: 400px;
  max-height: 700px;
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
