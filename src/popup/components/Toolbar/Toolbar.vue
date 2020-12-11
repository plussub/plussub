<template>
  <div ref="draggableAreaRef" class="grid shadow home-toolbar--container--content cursor-grab active:cursor-grabbing bg-primary-500 text-on-primary-500">
    <a v-if="hasBack" style="grid-area: logo" @click="backFn ? backFn() : toHome()">
      <fa icon="chevron-left" class="h-full py-2 pl-1 hover:text-on-primary-hover-500"/>
    </a>
    <div v-else>
      <logo style="grid-area: logo" class="h-full w-full" />
    </div>

    <div style="grid-area: buttons" class="flex justify-end font-header font-medium text-xl">
      <slot />
    </div>
    <div style="grid-area: close" class="mt-1.5 mr-2">
      <a @click="close">
        <fa icon="times" class="h-icon-sm hover:text-on-primary-hover-500" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { useDraggableArea } from '@/composables';
import { default as Logo } from './Logo.vue';

import { close } from './close';
import { default as logo } from '@/res/plussub128.png';
import { toHome } from '@/navigation/state/actions';

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
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    return {
      toHome,
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
