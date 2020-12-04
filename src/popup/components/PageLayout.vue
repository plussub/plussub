<template>
  <div class="plussub-toolbar">
    <!--    <transition name="toolbar-transition" appear>-->
    <Toolbar :has-back="hasBack" :back-fn="backFn">
      <slot name="toolbar" />
    </Toolbar>
    <!--    </transition>-->
  </div>

  <transition :name="contentTransitionName" appear>
    <div class="plussub-content">
      <slot name="content" />
    </div>
  </transition>
</template>

<script lang="ts">
import { default as Toolbar } from '@/components/Toolbar/Toolbar.vue';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  components: {
    Toolbar
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
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
  }
});
</script>

<style scoped>
/* plussub header */
.plussub-toolbar {
  grid-area: toolbar;
  z-index: 1000;

  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: var(--toolbar-height);
  box-shadow: var(--toolbar-shadow);
}

.plussub-content {
  grid-area: content;
  overflow-y: auto;
  background-color: var(--background-color);
  width: 100%;
  max-width: 100%;
}
</style>
