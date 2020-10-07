<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" class="home-toolbar--container--content">
        <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain"/>
        <div style="grid-area: buttons; display: flex; justify-content: flex-end">
          <a v-if="appState.state !== 'NONE'" class="knopf flat pill buttonOnPrimary"
             @click="$emit('navigate', { name: 'TRANSCRIPT', params: { contentTransitionName: 'content-navigate-deeper' } })">
            <!-- This icon comes from material design icons which is under Apache license -->
            <img :src="subtitleIcon" style="filter: invert(1)"/>
          </a>
          <a class="knopf flat pill buttonOnPrimary"
             @click="$emit('navigate', { name: 'SEARCH', params: { contentTransitionName: 'content-navigate-deeper' } })">
            <i class="fa fa-search fa-lg"></i>
          </a>
          <a class="knopf flat pill buttonOnPrimary"
             @click="$emit('navigate', { name: 'FILE-PICK', params: { contentTransitionName: 'content-navigate-deeper' } })">
            <i class="fa fa-upload fa-lg"></i>
          </a>
          <a class="knopf flat pill buttonOnPrimary" @click="close"><i class="fa fa-times fa-lg"></i></a>
        </div>
      </div>
    </template>
    <template #content>
      <div class="home-content--container">
        <transition name="fade" mode="out-in">
          <ResultFromSearch
              v-if="appState.state !== 'NONE' && appState.src === 'SEARCH'"
              style="grid-area: current-sub; margin-top: 20px"
              :state="appState.state"
              :search-state="appState.search"
              @remove="remove"
          >
            <template #settings>
              <Settings :parsed="appState.srt.parsed" :offset-time="appState.offsetTime" @offset-time="setOffsetTime"/>
            </template>
          </ResultFromSearch>
          <ResultFromFile
              v-else-if="appState.state !== 'NONE' && appState.src === 'FILE'"
              style="grid-area: current-sub; margin-top: 20px"
              :state="appState.state"
              :file-pick-state="appState.filePick"
              @remove="remove"
          >
            <template #settings>
              <Settings :parsed="appState.srt.parsed" :offset-time="appState.offsetTime" @offset-time="setOffsetTime"/>
            </template>
          </ResultFromFile>
          <NoSub v-else style="grid-row: 1/2; grid-column: 1/4"></NoSub>
        </transition>
        <PageVideos style="grid-area: videos" :subtitle="appState.srt.withOffsetParsed"/>
        <Debug v-show="false" style="grid-area: debug"/>
      </div>
    </template>
  </PageLayout>
</template>


<script setup="props" lang="ts">
import {ref, reactive} from 'vue';
import {useAppStateStorageListener} from 'useAppStateStorageListener';
import {snapshot} from '@/appState';
import {useDraggableArea} from '@/composables';

declare const props: {
  contentTransitionName: string;
}

export {default as logo} from '@/res/plussub128.png';
export {default as subtitleIcon} from '@/res/subtitles-24px.svg';
export {default as PageLayout} from '@/components/PageLayout';
export {default as ResultFromSearch} from '@/home/resultFromSearch/ResultFromSearch';
export {default as ResultFromFile} from '@/home/resultFromFile/ResultFromFile';
export {default as NoSub} from '@/home/noSub/NoSub';
export {default as PageVideos} from '@/home/pageVideos/PageVideos';
export {default as Debug} from '@/home/debug/Debug';
export {default as Settings} from '@/home/settings/Settings';

export {setOffsetTime} from '@/home/setOffsetTime';
export {remove} from '@/home/remove';

export const draggableAreaRef = ref(null);
useDraggableArea({draggableAreaRef});

export const appState = reactive({});
useAppStateStorageListener((state) => Object.assign(appState, state));
Object.assign(appState, await snapshot());

export const close = (): void => {
  document.getElementById('plussubShadow')?.remove();
  window.postMessage({plusSubAction: 'removeMessageEventListener'}, '*');
}

export default {
  emits: ['navigate']
};
</script>

<style scoped>
/* plussub header */
.home-toolbar--container--content {
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas: 'logo buttons .';
  grid-template-rows: 40px;
  grid-template-columns: 64px 1fr 16px;
}

.home-content--container {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. current-sub .'
    '. videos .'
    '. debug .';
  grid-template-rows: auto auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
  row-gap: 16px;
}
</style>
