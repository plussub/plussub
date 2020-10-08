<template>
  <div class="plussub-toolbar">
    <!--    <transition name="toolbar-transition" appear>-->
    <slot name="toolbar" />
    <!--    </transition>-->
  </div>

  <transition :name="contentTransitionName ? contentTransitionName : ''" appear>
    <div class="plussub-content">
      <slot name="content" />
    </div>
  </transition>
</template>

<script setup="props" lang="ts">
declare const props: {
  contentTransitionName?: string
}
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
