<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div class="home-toolbar--container--content">
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
          <a class="knopf flat pill buttonOnPrimary" @click="openOptionPage"><i class="fa fa-times fa-lg"></i></a>
        </div>
      </div>
    </template>
    <template #content>
      <div class="home-content--container">
        <transition name="fade">
          <result-from-search v-if="appState.state !== 'NONE' && appState.src === 'SEARCH'"
                              style="grid-area: current-sub;" @remove="remove"></result-from-search>
          <result-from-file v-else-if="appState.state !== 'NONE' && appState.src === 'FILE'"
                            style="grid-area: current-sub;" @remove="remove"></result-from-file>
          <no-sub v-else style="grid-area: current-sub;"></no-sub>
        </transition>
        <current-videos style="grid-area: videos;"/>
        <offset-time style="grid-area: offset;"/>
        <debug style="grid-area: debug;"/>
        <div style="grid-area: spacer;">&nbsp;</div>
      </div>
    </template>
  </page-layout>
</template>


<script>
import logo from '@/res/plussub128.png';
import {openOptionPage} from 'openOptionPage';
import Divider from '@/components/Divider';
import {useAppStateStorageListener} from 'useAppStateStorageListener';
import PageLayout from '@/components/PageLayout';
import ResultFromSearch from '@/home/ResultFromSearch';
import ResultFromFile from '@/home/ResultFromFile';
import NoSub from '@/home/NoSub';
import CurrentVideos from '@/home/CurrentVideos';
import {snapshot} from '@/../shared/appState';
import {remove} from '@/home/remove';
import {reactive} from "@vue/reactivity";
import OffsetTime from "@/home/OffsetTime";
import Debug from "@/home/Debug";

export default {
  components: {
    OffsetTime,
    Debug,
    Divider,
    PageLayout,
    ResultFromSearch,
    ResultFromFile,
    NoSub,
    CurrentVideos
  },
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    }
  },
  async setup() {
    const appState = reactive({});
    useAppStateStorageListener((state) => Object.assign(appState, state));
    Object.assign(appState, await snapshot());

    return {
      appState,
      logo,
      openOptionPage,
      remove: async () => {
        return Object.assign(appState, await remove());
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
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. current-sub .'
    '. videos .'
    '. offset .'
    '. debug .'
    '. spacer .';
  grid-template-rows: auto auto auto auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
  row-gap: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 130px;
}
</style>
