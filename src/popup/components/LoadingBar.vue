<template>
  <div style="box-sizing: border-box">
    <transition name="fade-loading-bar" mode="out-in">
      <div v-if="loading || error" class="h-px relative border-t border-solid border-surface-200 mr-1">
        <div class="absolute h-1" :class="{ 'loading-bar': !error, 'bg-primary-700': !error, 'bg-error-icon': error, 'w-full': error }">&nbsp;</div>
      </div>
    </transition>

    <Divider class="w-full border-surface-400" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { default as Divider } from './Divider.vue';

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
  animation: loading-bar 2.5s infinite ease-in-out;
}
</style>

<style>
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
