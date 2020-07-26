<template>
  <div class="no-sub--container--card">
    <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
      No subtitle selected
    </div>
    <div style="grid-area: card-content; width: 100%; font-size: 0.75em; line-height: 1.6; margin-bottom: 16px;">
      <div style="width: 100%;">Hi, you currently have no subtitle selected.</div>
      <div style="width: 100%;">To search subtitle online use <i class="fa fa-search fa-sm"></i>.</div>
      <div style="width: 100%;">If you want to load a subtitle file use <i class="fa fa-upload fa-sm"></i>.</div>
    </div>
  </div>
</template>

<style>
.no-sub--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
</style>
