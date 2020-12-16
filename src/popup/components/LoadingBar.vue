<template>
  <div>
    <transition name="fade-loading-bar" mode="out-in">
      <div v-show="loading" class="h-px relative border-t border-solid border-surface-200 w-full">
        <div class="absolute h-1 bg-primary-700 loading-bar">&nbsp;</div>
      </div>
    </transition>
    <Divider v-show="!loading" class="w-full border-surface-200" />
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import { default as Divider } from '@/components/Divider.vue';

export default defineComponent({
  components: {
    Divider,
  },
  props: {
    loading: {
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

.loading-bar{
  animation: loading-bar 2.5s infinite ease-in-out
}

@keyframes loading-bar {
  0% {
    left: 0;
    width: 0;
  }
  50% {
    width: 100%;
  }
  100% {
    right: 0;
    width: 0;
  }
}
</style>
