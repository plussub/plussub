<template>
  <div class="w-full z-10">
    <!--    <transition name="toolbar-transition" appear>-->
      <slot name="toolbar" />
    <!--    </transition>-->
  </div>

  <transition :name="contentTransitionName" appear>
    <div class="w-full max-w-full overflow-y-auto relative bg-surface-50 text-on-surface-50 font-sans content-pane">
      <slot name="content" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  }
});
</script>
