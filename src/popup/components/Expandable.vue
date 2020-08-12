<template>
  <div>
    <div @click="toggle" style="font-size: var(--card-sub-header-font-size); color: var(--default-header-text-color); display: flex;">
      <div style="flex-grow: 1">
        <slot name="title"/>
      </div>
      <transition :name="show ? 'menu-more' : 'menu-less'">
        <span v-if="show"><a class="knopf flat pill sharp menu-dropdown-chevron"><i class="fa fa-chevron-up fa-lg"></i></a></span>
        <span v-else><a class="knopf flat pill sharp menu-dropdown-chevron"><i class="fa fa-chevron-down fa-lg"></i></a></span>
      </transition>
    </div>
    <transition name="slide">
      <div v-show="show">
        <slot name="content"/>
      </div>
    </transition>
  </div>
</template>

<script>
import {ref} from 'vue';

export default {
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const show = ref(props.open)
    return {
      show,
      toggle() {
        this.show = !this.show;
      }
    }
  }
}
</script>

<style scoped>/* plussub header */
.knopf.menu-dropdown-chevron:hover,
.knopf.menu-dropdown-chevron {
  --knopf-text-color: var(--default-header-text-color);
  --knopf-background-color: transparent;
}
</style>
