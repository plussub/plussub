<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div ref="draggableAreaRef" class="home-toolbar--container--content">
        <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain;"/>
        <div style="grid-area: buttons; display: flex; justify-content: flex-end;">
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
          <result-from-search v-if="appState.state !== 'NONE' && appState.src === 'SEARCH'"
                              style="grid-area: current-sub; margin-top: 20px;"
                              :state="appState.state"
                              :search-state="appState.search"
                              @remove="remove">
            <template #settings>
              <settings :parsed="appState.srt.parsed" :offset-time="appState.offsetTime" @offset-time="setOffsetTime"/>
            </template>
          </result-from-search>
          <result-from-file v-else-if="appState.state !== 'NONE' && appState.src === 'FILE'"
                            style="grid-area: current-sub; margin-top: 20px;"
                            :state="appState.state"
                            :file-pick-state="appState.filePick"
                            @remove="remove">
            <template #settings>
              <settings :parsed="appState.srt.parsed" :offset-time="appState.offsetTime" @offset-time="setOffsetTime"/>
            </template>
          </result-from-file>
          <no-sub v-else style="grid-row: 1/2; grid-column: 1/4"></no-sub>
        </transition>
        <page-videos style="grid-area: videos;" :subtitle="appState.srt.withOffsetParsed" :videosInIframe="videosInIframe"/>
        <debug v-show="false" style="grid-area: debug;"/>
      </div>
    </template>
  </page-layout>
</template>


<script>
import {ref, watch} from "vue";
import logo from '@/res/plussub128.png';
import Divider from '@/components/Divider';
import {useAppStateStorageListener} from 'useAppStateStorageListener';
import PageLayout from '@/components/PageLayout';
import ResultFromSearch from '@/home/ResultFromSearch';
import ResultFromFile from '@/home/ResultFromFile';
import NoSub from '@/home/NoSub';
import PageVideos from '@/home/PageVideos';
import {snapshot} from '@/appState';
import {remove} from '@/home/remove';
import {reactive} from "@vue/reactivity";
import Debug from "@/home/Debug";
import {useDraggableArea} from "@/composables";
import {setOffsetTime} from "@/home/setOffsetTime";
import Settings from '@/home/Settings';
import { useStore } from '../store/index'

export default {
  components: {
    Debug,
    Divider,
    PageLayout,
    ResultFromSearch,
    ResultFromFile,
    NoSub,
    PageVideos,
    Settings
  },
  emits: ['navigate'],
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    },
    videosInIframe: Array
  },
  async setup() {
    const draggableAreaRef = ref(null);
    useDraggableArea({draggableAreaRef});

    const appState = reactive({});
    useAppStateStorageListener((state) => Object.assign(appState, state));
    Object.assign(appState, await snapshot());

    return {
      draggableAreaRef,
      appState,
      logo,
      remove,
      setOffsetTime,
      close() {
        document.getElementById('plussubShadow').remove();
        window.postMessage({ PlusSubAction: 'removeMessageEventListener' }, '*');
      }
    };
  }
};
</script>

<style scoped>/* plussub header */
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
