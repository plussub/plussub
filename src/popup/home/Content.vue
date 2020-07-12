<template>
  <div class="home-content--container">
    <div class="home-content--container--card" style="grid-area: offset; box-shadow: var(--card-shadow);">
      <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size);">
        Subtitle Offset Setting
      </div>
      <div style="grid-area: card-content; display: flex; width: 100%;">
        <div>
          <span style="font-size: 0.8em;">Actual</span>
          <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" value="0" type="text" disabled />
        </div>
        <div>
          <span style="font-size: 0.8em;">New</span>
          <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text" />
        </div>
      </div>
      <div style="grid-area: card-divider; align-self: end;">
        <divider/>
      </div>
      <div style="grid-area: card-action; justify-self: end;">
        <a class="knopf flat small">Apply</a>
        <a class="knopf flat small">Reset</a>
      </div>
    </div>
  </div>
</template>

<script>
 import Divider from '@/components/Divider';
 export default {
   components: {
     Divider
   }
 }
</script>

<style scoped>
.home-content--container {
  width: 100%;
  height: 100%;
  max-width: calc(100% - 32px);
  margin: 16px;
  display: grid;
  grid-template-areas:
    'current-sub'
    'offset';
  grid-template-rows: auto auto;
  grid-template-columns: 100%;
}

.home-content--container--card {
  display: grid;
  padding-top: 16px;
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: auto 16px 1fr 16px auto;
  grid-template-columns: 16px 1fr 16px;
  width: 100%;
}
</style>
