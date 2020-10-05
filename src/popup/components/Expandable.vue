<template>
  <div>
    <div style="font-size: var(--card-sub-header-font-size); color: var(--default-header-text-color); display: flex"
         @click="toggle">
      <div style="flex-grow: 1">
        <slot name="title"/>
      </div>
      <transition :name="show ? 'menu-more' : 'menu-less'">
        <span v-if="show"
        ><a class="knopf flat pill sharp menu-dropdown-chevron"><i class="fa fa-chevron-up fa-lg"></i></a
        ></span>
        <span v-else
        ><a class="knopf flat pill sharp menu-dropdown-chevron"><i class="fa fa-chevron-down fa-lg"></i></a
        ></span>
      </transition>
    </div>
    <transition name="slide">
      <div v-show="show">
        <slot name="content"/>
      </div>
    </transition>
  </div>
</template>

<script setup="props" lang="ts">
import {ref} from 'vue';

declare const props: {
  open: boolean | undefined
};
export const show = ref<boolean>(props.open ?? false);
export const toggle = (): unknown => show.value = !show.value;

</script>

<style scoped>
/* plussub header */
.knopf.menu-dropdown-chevron:hover,
.knopf.menu-dropdown-chevron {
  --knopf-text-color: var(--default-header-text-color);
  --knopf-background-color: transparent;
}
</style>
