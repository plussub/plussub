<template>
  <div style="box-sizing: border-box">
    <transition name="fade-loading-bar" mode="out-in">
      <sl-progress-bar v-if="loading || error" :percentage="100" :indeterminate="loading" :class="{error}" style="--height: 1px"></sl-progress-bar>
    </transition>
    <Divider class="w-full border-surface-400" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { default as Divider } from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider
  },
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    error: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    }
  }
});
</script>
<style scoped>
.fade-loading-bar-enter-active,
.fade-loading-bar-leave-active {
  transition: all 1.5s ease;
  max-height: 2px;
}

.fade-loading-bar-enter-from,
.fade-loading-bar-leave-to {
  opacity: 0;
  max-height: 0;
}

.loading-bar {
  --height: 1px;
}

sl-progress-bar.error::part(indicator) {
  background-color: var(--sl-color-danger-500);
}

@keyframes loading-bar {
  0% {
    left: 0;
    width: 0;
  }
  50% {
    width: calc(100% - 5px);
  }
  100% {
    right: 0;
    width: 0;
  }
}
</style>
