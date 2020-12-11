<template>
  <div>
    <div class="font-header font-size-xl flex hover:cursor-pointer" @click="toggle">
      <div class="flex-grow" :class="{'text-primary-700': show}">
        <slot name="title" />
      </div>
      <a class="menu-dropdown-chevron">
        <fa v-if="show" icon="chevron-up" class="h-icon text-primary-700"/>
        <fa v-else icon="chevron-down" class="h-icon"/>
      </a>
    </div>
    <transition name="slide">
      <div class="expandable-content" :class="{ show: show }">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, Ref, ref} from 'vue';

export default defineComponent({
  props: {
    open: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    }
  },
  setup(props) {
    const show: Ref<boolean> = ref(props.open ?? false);

    return {
      show,
      toggle: (): unknown => (show.value = !show.value)
    }
  }
});
</script>

<style scoped>

.fa.fa-chevron-down.fa-lg {
  transition: transform 0.3s ease-in-out;
}

.fa.fa-chevron-down.fa-lg.show {
  transform: rotate(-180deg);
}

.expandable-content {
  max-height: 0;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.expandable-content.show {
  max-height: 999px;
}
</style>
