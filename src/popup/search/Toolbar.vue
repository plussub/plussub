<template>
  <div style="background-color: var(--primary); color: var(--onPrimary); width: 100%; height: 40px; box-shadow: var(--toolbar-shadow); display: flex;">
    <toolbar-back-to-home style="height: 100%;" />
    <search-bar @on-search-results="onSearchResults" style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px;"/>
  </div>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';
import SearchBar from '@/search/SearchBar.vue';
import { emit } from '@/composables';

export default {
  components: {
    ToolbarBackToHome,
    SearchBar
  },
  setup(){
    return {
      onSearchResults(result) {
        emit('searchResult', result)
      }
    }
  }
};
</script>
