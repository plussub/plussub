<template>
  <div class="w-full z-10">
    <!--    <transition name="toolbar-transition" appear>-->
    <Toolbar :has-back="hasBack" :back-fn="backFn">
      <slot name="toolbar" />
    </Toolbar>
    <!--    </transition>-->
  </div>

  <transition :name="contentTransitionName" appear>
    <div class="w-full max-w-full overflow-y-auto bg-surface-50 text-on-surface-50 font-sans">
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
