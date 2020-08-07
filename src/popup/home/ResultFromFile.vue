<template>
  <div class="result-from-file--card" style="position: relative;">
    <div style="position: absolute; top: 8px; right: 16px; display: flex;">
      <div style="font-size: 0.5em; margin-right: 16px;">{{ prettyState }}</div>
      <div style="font-size: 0.5em;">
        <transition name="fade" mode="out-in">
          <spinner v-if="state !== 'DONE'"/>
          <i v-else class="fa fa-check fa-sm"></i>
        </transition>
      </div>
    </div>
    <div
        style="grid-area: header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); display: flex;">
      <div>Subtitle via file</div>
    </div>
    <div
        style="grid-area: details; width: 100%; font-size: 0.75em; line-height: 1.6; margin-bottom: 16px; display: grid; grid-template-columns: auto 1fr; grid-column-gap: 16px;">
      <div style="grid-column: 1 / 2;">Filename:</div>
      <div style="grid-column: 2 / 3;">{{ filePickState.filename }}</div>
    </div>

    <divider style="grid-area: details-divider; align-self: end;"/>
    <div style="grid-area: settings">
      <settings />
    </div>
    <divider style="grid-area: settings-divider; align-self: end;"/>
    <div style="grid-area: actions; justify-self: end; align-self: center;">
      <a class="knopf flat block end large" style="width: 100%;" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script>
import Divider from '@/components/Divider';
import Spinner from '@/components/Spinner';
import {computed} from '@vue/reactivity';
import Settings from '@/home/Settings';

export default {
  components: {
    Divider,
    Spinner,
    Settings
  },
  props: {
    state: String,
    filePickState: Object
  },
  setup(props) {
    return {
      prettyState: computed(() => `${props.state.charAt(0).toUpperCase()}${props.state.slice(1).toLowerCase()}`)
    };
  }
};
</script>

<style scoped>/* plussub header */
.result-from-file--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '.                header           .'
    '.                .                .'
    '.                details          .'
    'details-divider  details-divider  details-divider'
    '.                settings         .'
    'settings-divider settings-divider settings-divider'
    '.                actions          .';
  grid-template-rows: auto 16px 1fr 16px 1fr 16px 50px;
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
