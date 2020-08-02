<template>
  <div class="result-from-file--card" style="position: relative;">
    <div style="position: absolute; top: 8px; right: 16px; display: flex;">
      <div style="font-size: 0.5em; margin-right: 16px;">{{ currentState }}</div>
      <div style="font-size: 0.5em;">
        <transition name="fade" mode="out-in">
          <spinner v-if="appState.state !== 'DONE'"/>
          <i v-else class="fa fa-check fa-sm"></i>
        </transition>
      </div>
    </div>
    <div
        style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); display: flex;">
      <div>Subtitle via file</div>
    </div>
    <div
        style="grid-area: card-content; width: 100%; font-size: 0.75em; line-height: 1.6; margin-bottom: 16px; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px;">
      <div style="grid-column: 1 / 2;">Filename:</div>
      <div style="grid-column: 2 / 3;">{{ appState.filePick.filename }}</div>
    </div>
    <div style="grid-area: card-divider; align-self: end;">
      <divider/>
    </div>
    <div style="grid-area: card-action; justify-self: end;">
      <a class="knopf flat block end small" style="width: 100%;" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script>
import {snapshot} from '../../shared/appState';
import Divider from '@/components/Divider';
import Spinner from '@/components/Spinner';
import {computed, reactive} from '@vue/reactivity';
import {useAppStateStorageListener} from "@/composables/useAppStateStorageListener";

export default {
  components: {
    Divider,
    Spinner
  },
  async setup() {
    const appState = reactive(await snapshot());
    useAppStateStorageListener((state) => Object.assign(appState, state));
    return {
      appState,
      currentState: computed(() => `${appState.state.charAt(0).toUpperCase()}${appState.state.slice(1).toLowerCase()}`)
    };
  }
};
</script>

<style>
.result-from-file--card {
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
  opacity: 1;
}
</style>
