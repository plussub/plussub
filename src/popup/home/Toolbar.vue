<template>
  <div class="home-toolbar--container">
    <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain;" />
    <div style="grid-area: buttons; display: flex; justify-content: flex-end;">
      <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({name: 'search'})"><i class="fa fa-search fa-lg"></i></a>
      <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({name: 'filepick'})"><i class="fa fa-upload fa-lg"></i></a>
      <a class="knopf flat pill small buttonOnPrimary" @click="openOptionPage"><i class="fa fa-cog fa-lg"></i></a>
    </div>
  </div>
</template>

<script>
import logo from '@/res/plussub128.png';
import { openOptionPage } from 'openOptionPage';

export default {
  setup() {
    return {
      logo,
      openOptionPage
    };
  }
};
</script>

<style>
.home-toolbar--container {
  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: 100%;
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas: 'logo buttons .';
  grid-template-rows: 40px;
  grid-template-columns: 64px 1fr 16px;
}
</style>
