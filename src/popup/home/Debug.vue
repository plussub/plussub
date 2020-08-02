<template>
  <div class="debug--card">
    <div
        style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
      Debug Menu
    </div>
    <div style="grid-area: card-content;">
      <a class="knopf flat small" @click="clearExtensionStorage">Clear Extension Storage</a>
    </div>
  </div>
</template>

<script>

import {clearExtensionStorage} from 'clearExtensionStorage';

export default {
  setup(){
    return {
      clearExtensionStorage
    }
  }
}
</script>

<style scoped>
.debug--card {
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
