<template>
  <div ref="draggableAreaRef" class="grid shadow home-toolbar--container--content cursor-grab active:cursor-grabbing bg-primary-500 text-on-primary-500">
    <a v-if="hasBack" style="grid-area: logo" @click="backFn ? backFn() : toHome()">
      <FontAwesomeIcon icon="chevron-left" class="h-full py-2 pl-1 hover:text-on-primary-hover-500" />
    </a>
    <div v-else>
      <logo style="grid-area: logo" class="h-full w-full hover:text-on-primary-hover-500 hover:cursor-pointer" @click="redirectHomePage" />
    </div>

    <div style="grid-area: buttons" class="flex justify-end font-header font-medium text-xl">
      <slot />
    </div>

    <div style="grid-area: close" class="flex items-center mr-3">
      <a @click="close">
        <FontAwesomeIcon icon="times" class="h-icon hover:text-on-primary-hover-500" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useDraggableArea } from '@/composables';
import Logo from './Logo.vue';

import logo from '@/res/logo128.png';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useCloseStore } from '@/close/store';

export default defineComponent({
  components: {
    FontAwesomeIcon,
    Logo
  },
  props: {
    hasBack: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    // todo replace with event
    backFn: {
      type: Function as PropType<() => unknown | undefined>,
      required: false,
      default: undefined
    }
  },
  setup() {
    const navigationStore = useNavigationStore();
    const closeStore = useCloseStore();
    const draggableAreaRef = ref(null);
    useDraggableArea({ draggableAreaRef });

    return {
      toHome: () => navigationStore.to("HOME", {contentTransitionName: "content-navigate-shallow"}),
      redirectHomePage: () =>  window.open("https://opensubtitles.com", '_blank'),
      logo,
      close: () => closeStore.close(),
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
