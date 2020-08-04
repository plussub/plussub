<template>
  <div class="knopf-group" style="display: flex; position: relative;">
    <a class="knopf even active flat subtitle-dropdown-label sharp start" style="flex-grow: 1; margin-left: -7px;" @click="toggleLanguageSelection">Subtitle language: {{ state.prettySelected }}</a>
    <a class="knopf even active pale sharp subtitle-dropdown-chevron" style="width: 40px;" @click="toggleLanguageSelection"><i class="fa fa-chevron-down fa-sm"></i></a>
    <transition name="slide-down">
      <div v-show="state.showLanguageSelection" class="search-toolbar--container--language--accordion" style="position: absolute; top: 27px; margin-left: -40px;">
        <input ref="input" style="grid-area: search-bar;" placeholder="Search language" type="text" v-model="state.query" />
        <div style="grid-area: content; overflow-y: auto;">
          <a class="knopf flat block" style="width: 100%;" v-for="lang in state.languageList" :key="lang.iso639_2" @click="select(lang)">{{ lang.iso639Name }} ({{ lang.iso639_2 }})</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import languageList from '@/res/iso639List.json';
import { computed, reactive } from 'vue';

export default {
  props: {
    selected: String
  },
  setup(props, { emit }) {
    const state = reactive({
      showLanguageSelection: false,
      prettySelected: computed(() => `${props.selected.charAt(0).toUpperCase()}${props.selected.slice(1)}`),
      query: '',
      languageList: computed(() => {
        if (state.query === '') {
          return languageList;
        }
        const lowerCaseQuery = state.query.toLowerCase();
        return languageList.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(lowerCaseQuery) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      })
    });

    return {
      state,
      props,
      toggleLanguageSelection() {
        state.showLanguageSelection = !state.showLanguageSelection;
        if(state.showLanguageSelection){
          this.$refs.input.focus();
        }
      },
      select({ iso639_2 }) {
        state.showLanguageSelection = false;
        emit('update:selected', iso639_2);
      }
    };
  }
};
</script>

<style scoped>/* plussub header */
.search-toolbar--container--language--accordion {
  --search-bar-size: 25px;
  --accordion-size: 250px;
  width: 100vw;
  height: var(--accordion-size);
  max-height: 250px;
  background-color: var(--surface-color);
  color: var(--on-surface);
  box-shadow: var(--card-shadow);
  display: grid;
  grid-template-areas:
    'search-bar'
    'content';
  grid-template-rows: var(--search-bar-size) max(calc(var(--accordion-size) - var(--search-bar-size)));
}

.active.subtitle-dropdown-label:hover,
.active.subtitle-dropdown-label {
  --knopf-font-size: 1em;
}
.active.subtitle-dropdown-chevron,
.active.subtitle-dropdown-label {
  --knopf-text-color: var(--onPrimary);
}

.slide-down-leave-active,
.slide-down-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: linear;
}

.slide-down-enter-to, .slide-down-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-down-enter-from, .slide-down-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
