<template>
  <div class="no-sub--container">
    <div
        style="grid-area: header; font-family: var(--card-header-font-family); color: var(--default-header-text-color);">
      Hi, you currently have no subtitle selected.
    </div>
    <div style="grid-area: content; width: 100%; font-size: 0.75em; line-height: 1.6; height: 0;">
      <div style="width: 100%;">To search subtitle online use <i class="fa fa-search fa-sm"></i>.</div>
      <div style="width: 100%;">If you want to load a subtitle file use <i class="fa fa-upload fa-sm"></i>.</div>
    </div>
    <divider style="grid-area: divider"/>
  </div>
</template>

<script>
import Divider from '@/components/Divider'

export default {
  components: {
    Divider
  }
}
</script>

<style scoped>/* plussub header */
.no-sub--container {
  background-color: var(--primary50);
  /*box-shadow: var(--card-shadow);*/
  margin-top: -20px;
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '.      header  .'
    '.      content .'
   'divider divider divider';
  grid-template-rows: 25px auto 1px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
</style>
