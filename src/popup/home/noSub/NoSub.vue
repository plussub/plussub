<template>
  <div class="no-sub--container">
    <div
        style="grid-area: header; font-family: var(--card-header-font-family); font-size: 1.1em; color: var(--default-header-text-color); align-self: end; font-weight: 500;">
      Hi, you currently have no subtitle selected.
    </div>
    <div style="grid-area: content; width: 100%; font-size: 0.85em; line-height: 1.8; font-weight: 300;">
      <div style="width: 100%;">To search subtitle online use <i class="fa fa-search fa-sm"></i>.</div>
      <div style="width: 100%;">If you want to load a subtitle file use <i class="fa fa-upload fa-sm"></i>.</div>
    </div>
    <Divider style="grid-area: divider"/>
  </div>
</template>

<script setup lang="ts">
export {default as Divider} from '@/components/Divider'
</script>

<style scoped>
/* plussub header */
.no-sub--container {
  background-color: var(--primary50);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '.      .       .'
    '.      header  .'
    '.      content .'
   'divider divider divider';
  grid-template-rows: 8px 25px auto 1px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  height: fit-content;
  grid-row-gap: 8px;
}
</style>
