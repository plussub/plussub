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
  <div v-else-if="state.selected === 'TRANSCRIPT'" class="app--container">
    <Suspense>
      <template #default>
        <transcript @navigate="navigate" v-bind="state.selectedParams" :videosInIframe="videosInIframe"/>
      </template>
      <template #fallback>
        <div> loading</div>
      </template>
    </Suspense>
  </div>
  <div class="app--container" v-else>
    <Suspense>
      <template #default>
        <home @navigate="navigate" v-bind="state.selectedParams" :videosInIframe="videosInIframe"/>
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
import Transcript from '@/transcript/Transcript.vue';
// import {reactive} from "@vue/reactivity";
import {ref, reactive} from 'vue'

export default {
  components: {
    KnopfCss,
    Home,
    FilePick,
    Search,
    SubtitleSelection,
    Transcript
  },
  setup() {
    const state = reactive({selected: 'HOME', selectedParams: {}});

    const videosInIframe = ref([])
    const handleMessage = (e) => {
      const { plusSubAction, src, hasSubtitle } = e.data;
      if (plusSubAction === 'sendiFrameSrc') {
        if (videosInIframe.value.findIndex((video) => video.src === src) === -1) {
          videosInIframe.value.push({ src, hasSubtitle })
        }
      } else if (plusSubAction === 'removeMessageEventListener') {
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  
    return {
      state,
      videosInIframe,
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
  transition: opacity .25s ease;
}

.fade-enter-from, .fade-leave-to {
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

.slide-enter-to, .slide-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
  overflow: hidden;
  max-height: 0;
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
