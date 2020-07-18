<template>
  <div class="subtitle-selection-toolbar--container">
    <toolbar-back-to-home style="grid-area: back;" />
    <div style="grid-area: filter-bar;"> filter-bar</div>
<!--    <filter-bar @on-search-results="onSearchResults" style="grid-area: search-bar;"/>-->
    <language-accordion v-model:selected="state.selectedLanguage" style="grid-area: sub-lang-drop-down;" />
  </div>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';
import LanguageAccordion from '@/subtitleSelection/LanguageAccordion.vue';
import { reactive } from 'vue';

export default {
  components: {
    ToolbarBackToHome,
    LanguageAccordion
  },
  setup() {
    const state = reactive({
      selectedLanguage: 'de'
    });
    return {
      state
    };
  }
};
</script>

<style scoped>
  .subtitle-selection-toolbar--container {
    background-color: var(--primary);
    color: var(--onPrimary);
    width: 100%;
    height: 100%;
    box-shadow: var(--toolbar-shadow);
    display: grid;
    grid-template-areas:
            'back . . .'
            'back . filter-bar .'
            'back . . .'
            'back . sub-lang-drop-down .'
            'back . . .';
    grid-template-rows: 16px 25px 16px 25px 8px;
    grid-template-columns: auto 8px 1fr 16px;
  }
</style>
