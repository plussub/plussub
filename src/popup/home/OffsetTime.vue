<template>
  <div class="offset--card">
    <div
        style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
      Subtitle offset setting
    </div>
    <div style="grid-area: card-content; display: flex; width: 100%;">
      <div>
        <span style="font-size: 0.8em;">Actual</span>
        <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" :value="appState.offsetTime"
               type="text" disabled/>
      </div>
      <div>
        <span style="font-size: 0.8em;">New</span>
        <input ref="input" style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text"/>
      </div>
    </div>
    <div style="grid-area: card-divider; align-self: end;">
      <divider/>
    </div>
    <div style="grid-area: card-action; justify-self: end;">
      <a class="knopf flat small" @click="setOffsetTime">Apply</a>
      <a class="knopf flat small" @click="reset">Reset</a>
    </div>
  </div>
</template>

<script>
import {reactive} from "@vue/reactivity";
import {snapshot} from "../../shared/appState";
import {useAppStateStorageListener} from 'useAppStateStorageListener';
import Divider from "../components/Divider";
import {setOffsetTime} from "./setOffsetTime";

export default {
  components: {
    Divider
  },
  async setup() {
    const appState = reactive({});
    useAppStateStorageListener((state) => Object.assign(appState, state));
    Object.assign(appState, await snapshot());

    return {
      appState,
      setOffsetTime() {
        setOffsetTime({offsetTime: parseInt(this.$refs.input.value, 10)});
      },
      reset(){
        setOffsetTime({offsetTime: 0});
      }
    };
  }
}
</script>

<style scoped>/* plussub header */
.offset--card {
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
