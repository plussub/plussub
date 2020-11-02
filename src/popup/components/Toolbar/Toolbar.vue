<template>
  <div ref="draggableAreaRef" class="home-toolbar--container--content">
    <a v-if="hasBack" class="knopf flat pill sharp buttonOnPrimary" style="grid-area: logo;" @click="backFn ? backFn() : toHome()">
      <fa icon="chevron-left"/>
    </a>
    <div v-else style="width: 64px;">
      <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain" />
    </div>

    <div style="grid-area: buttons; display: flex; justify-content: flex-end">
      <slot />
    </div>
    <div style="grid-area: close">
      <a class="knopf flat pill buttonOnPrimary" @click="close">
        <fa icon="times" style="height: var(--icon-size-sm)" />
      </a>
    </div>
  </div>
</template>

<script setup="props" lang="ts">
import { ref } from 'vue';
import { useDraggableArea } from '@/composables';

export { close } from './close';
export { default as logo } from '@/res/plussub128.png';
export { toHome } from '@/navigation/state/actions';

declare const props: {
  hasBack?: boolean;
  backFn?: () => void;
};

export const draggableAreaRef = ref(null);
useDraggableArea({ draggableAreaRef });
</script>

<style scoped>
/* plussub header */
.home-toolbar--container--content {
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas: 'logo buttons close .';
  grid-template-rows: 40px;
  grid-template-columns: auto 1fr auto 4px;
}
.home-toolbar--container--content:hover {
  cursor: grab;
}

.home-toolbar--container--content:active {
  cursor: grabbing;
}
</style>
