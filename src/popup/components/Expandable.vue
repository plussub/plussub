<template>
  <div>
    <div style="font-size: var(--card-sub-header-font-size); color: var(--default-header-text-color); display: flex" @click="toggle">
      <div style="flex-grow: 1">
        <slot name="title" />
      </div>
      <a class="knopf flat pill sharp menu-dropdown-chevron"><i class="fa fa-chevron-down fa-lg" :class="{ show: show }"></i></a>
    </div>
    <transition name="slide">
      <div class="expandable-content" :class="{ show: show }">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script setup="props" lang="ts">
import { ref } from 'vue';

declare const props: {
  open: boolean | undefined;
};
export const show = ref<boolean>(props.open ?? false);
export const toggle = (): unknown => (show.value = !show.value);
</script>

<style scoped>
/* plussub header */
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
