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

<script lang="ts">
import {defineComponent, ref, PropType} from 'vue';
import { useDraggableArea } from '@/composables';

import { close } from './close';
import { default as logo } from '@/res/plussub128.png';
import { toHome } from '@/navigation/state/actions';

export default defineComponent({
  props: {
    hasBack: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    backFn: {
      type: Function as PropType<() => unknown | undefined>,
      required: false,
      default: undefined
    }
  },
  setup(){
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    return {
      toHome,
      logo,
      close,
      draggableAreaRef
    }
  }
});
</script>

<style scoped>

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
