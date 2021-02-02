<template>
  <div ref="draggableAreaRef" class="grid shadow home-toolbar--container--content cursor-grab active:cursor-grabbing bg-primary-500 text-on-primary-500">
    <a v-if="hasBack" style="grid-area: logo" @click="backFn ? backFn() : toHome()">
      <fa icon="chevron-left" class="h-full py-2 pl-1 hover:text-on-primary-hover-500"/>
    </a>
    <div v-else>
      <logo style="grid-area: logo" class="h-full w-full" />
    </div>

    <div style="grid-area: buttons" class="flex justify-end font-header font-medium text-xl mr-3">
      <slot />
    </div>

    <div style="grid-area: close" class="flex items-center mr-3">
      <a @click="close">
        <fa icon="times" class="h-icon hover:text-on-primary-hover-500" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, PropType, inject} from 'vue';
import { useDraggableArea } from '@/composables';
import Logo from './Logo.vue';

import { close } from './close';
import logo from '@/res/plussub128.png';
import { NavigationStore } from '@/navigation/store';

export default defineComponent({
  components: {
    Logo
  },
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
  setup() {
    const navigationStore = inject<NavigationStore>('navigationStore');
    if(!navigationStore){
      throw new Error('inject failed');
    }

    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    return {
      toHome: navigationStore.actions.toHome,
      logo,
      close,
      draggableAreaRef
    };
  }
});
</script>

<style scoped>
.home-toolbar--container--content {
  grid-template-areas: 'logo buttons close .';
  grid-template-rows: 40px;
  grid-template-columns: 50px 1fr auto 4px;
}
</style>
