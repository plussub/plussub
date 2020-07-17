<template>
  <div class="search-toolbar--container">
    <toolbar-back-to-home style="grid-area: back;" />
    <search-bar @on-search-results="onSearchResults" style="grid-area: search-bar;"/>
    <language-accordion v-model:selected="state.selectedLanguage" style="grid-area: sub-lang-drop-down;"/>
  </div>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';
import SearchBar from '@/search/SearchBar.vue';
import LanguageAccordion from '@/search/LanguageAccordion.vue';
import {reactive} from "vue";
import { emit } from '@/composables';

export default {
  components: {
    ToolbarBackToHome,
    SearchBar,
    LanguageAccordion
  },
  setup(){
    const state = reactive({
      selectedLanguage: 'de',
    });

    return {
      state,
      onSearchResults(result) {
        emit('searchResult', result)
      }
    }
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
</style>
