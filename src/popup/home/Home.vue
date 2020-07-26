<template>
  <page-layout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <div class="home-toolbar--container--content">
        <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain;" />
        <div style="grid-area: buttons; display: flex; justify-content: flex-end;">
          <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({ name: 'search', params: { contentTransitionName: 'content-navigate-deeper' } })">
            <i class="fa fa-search fa-lg"></i>
          </a>
          <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({ name: 'filepick', params: { contentTransitionName: 'content-navigate-deeper' } })">
            <i class="fa fa-upload fa-lg"></i>
          </a>
          <a class="knopf flat pill small buttonOnPrimary" @click="openOptionPage"><i class="fa fa-cog fa-lg"></i></a>
        </div>
      </div>
    </template>
    <template #content>
      <div class="home-content--container">
        <transition name="fade" appear>
          <result-from-search v-if="appState.state === 'SELECTED' && appState.src === 'SEARCH'" style="grid-area: current-sub;" @remove="remove"></result-from-search>
          <div v-else class="home-content--no-sub--container--card" style="grid-area: current-sub;">
            <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
              No subtitle selected
            </div>
            <div style="grid-area: card-content; width: 100%; font-size: 0.75em; line-height: 1.6; margin-bottom: 16px;">
              <div style="width: 100%;">Hi, you currently have no subtitle selected.</div>
              <div style="width: 100%;">To search subtitle online use <i class="fa fa-search fa-sm"></i>.</div>
              <div style="width: 100%;">If you want to load a subtitle file use <i class="fa fa-upload fa-sm"></i>.</div>
            </div>
          </div>
        </transition>
        <div class="home-content--offset--container--card" style="grid-area: offset;">
          <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
            Subtitle offset setting
          </div>
          <div style="grid-area: card-content; display: flex; width: 100%;">
            <div>
              <span style="font-size: 0.8em;">Actual</span>
              <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" :value="appState.offsetTime.time" type="text" disabled />
            </div>
            <div>
              <span style="font-size: 0.8em;">New</span>
              <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text" />
            </div>
          </div>
          <div style="grid-area: card-divider; align-self: end;">
            <divider />
          </div>
          <div style="grid-area: card-action; justify-self: end;">
            <a class="knopf flat small">Apply</a>
            <a class="knopf flat small">Reset</a>
          </div>
        </div>

        <div class="home-content--debug--container--card" style="grid-area: debug;">
          <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
            Debug Menu
          </div>
          <div style="grid-area: card-content;">
            <a class="knopf flat small">Show loaded </a>
          </div>
        </div>

        <div style="grid-area: spacer;">&nbsp;</div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import logo from '@/res/plussub128.png';
import { openOptionPage } from 'openOptionPage';
import Divider from '@/components/Divider';
import PageLayout from '@/components/PageLayout';
import ResultFromSearch from '@/home/ResultFromSearch';
import { snapshot } from '@/../shared/appState';
import { remove } from '@/home/remove';

export default {
  components: {
    Divider,
    PageLayout,
    ResultFromSearch
  },
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      appState: snapshot(),
      logo,
      openOptionPage,
      remove
    };
  }
};
</script>

<style scoped>
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
    '. offset .'
    '. debug .'
    '. spacer .';
  grid-template-rows: auto auto auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
  row-gap: 16px;
}

.home-content--no-sub--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}

.home-content--offset--container--card {
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

.home-content--debug--container--card {
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
