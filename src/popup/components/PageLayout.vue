<template>
  <div class="toolbar">
<!--    <transition name="toolbar-transition" appear>-->
      <slot name="toolbar"/>
<!--    </transition>-->
  </div>

  <transition :name="contentTransitionName" appear>
    <div class="content">
      <slot name="content"/>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    contentTransitionName: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>/* plussub header */
.toolbar {
  grid-area: toolbar;
  z-index: 1000;

  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: var(--toolbar-height);
  box-shadow: var(--toolbar-shadow);
}

.content {
  grid-area: content;
  overflow-y: auto;
  background-color: var(--background-color);
  padding-top: 12px;
  width: 100%;
  max-width: 100%;
}
</style>
