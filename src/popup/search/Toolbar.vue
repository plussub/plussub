<template>
  <div class="search-toolbar--container">
    <toolbar-back-to-home style="grid-area: back;" />

    <div class="knopf-group" style="grid-area: search-bar; display: flex;">
      <input style="flex-grow: 1;" placeholder="Search movie or series" id="search" type="text" v-model="state.query" />
      <a class="knopf flat pill small sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-search fa-sm"></i></a>
    </div>

    <div class="knopf-group" style="grid-area: sub-lang-drop-down; display: flex;">
      <a class="knopf even active flat subtitle-dropdown-label sharp" style="flex-grow: 1;">Subtitle language: En</a>
      <a class="knopf even active pale sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-chevron-down fa-sm"></i></a>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
import { emit, debounce } from '@/composables';
import { searchRequest } from '@/search/searchRequest';
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';

export default {
  components: {
    ToolbarBackToHome
  },
  setup() {
    const state = reactive({ query: '', queryResult: {} });
    const req = debounce({
      fn: searchRequest,
      timeout: 3000,
      cb: (result) => (state.queryResult = result)
    });

    watch(
      () => state.query,
      (search) => req(search)
    );
    watch(
      () => state.queryResult,
      (result) => emit('searchResult', result?.data?.videoSearch?.entries ?? [])
    );

    return {
      state
    };
  }
};
</script>

<style scoped>
.search-toolbar--container {
  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: 100%;
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas:
    'back . . .'
    'back . search-bar .'
    'back . . .'
    'back . sub-lang-drop-down .'
    'back . . .';
  grid-template-rows: 16px 25px 16px 25px 8px;
  grid-template-columns: auto 8px 1fr 16px;
}
.active.subtitle-dropdown-label:hover,
.active.subtitle-dropdown-label {
  --knopf-text-color: white;
  --knopf-font-size: 1em;
}
</style>
