<template>
  <div class="relative w-full">
    <div class="flex">
      <a class="flex-grow" :class="{'text-primary-700': showLanguageSelection}" @click="toggleShowLanguageSelection"> Subtitle language: {{ prettySelected }} </a>
      <transition :name="showLanguageSelection ? 'menu-more' : 'menu-less'">
        <span v-if="showLanguageSelection">
          <a @click="toggleShowLanguageSelection"> <fa icon="chevron-up" class="h-icon text-primary-700" /> </a
        ></span>
        <span v-else>
          <a @click="toggleShowLanguageSelection"> <fa icon="chevron-down" class="h-icon" /></a>
        </span>
      </transition>
    </div>

    <transition name="slide-down">
      <div v-show="showLanguageSelection" class="absolute mt-1 inset-x-0 inset-y-full z-30 grid h-full w-full bg-surface-100 shadow search-toolbar--container--language--accordion px-2">
        <div class="w-full flex justify-center grid focus-within:text-primary-700" style="grid-template-areas: 'bar'; grid-template-columns: 1fr; grid-template-rows: 30px">
          <input
            ref="input"
            v-model="query"
            class="w-full z-30 rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50"
            style="grid-area: bar"
            placeholder="Search language"
            type="text"
            @keydown.stop
            @keypress.stop
          />
          <div class="justify-self-end self-center mr-2 text z-30" style="grid-area: bar">
            <fa v-if="query" icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="clear" />
            <fa v-else icon="search" class="h-icon-sm" />
          </div>
        </div>
        <div style="grid-area: space" class="bg-surface-100">&nbsp;</div>
        <div class="overflow-y-auto overflow-x-hidden bg-surface-100 z-10 shadow-lg" style="grid-area: content">
          <div v-for="lang in languageList" class="w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer font-lg p-2" :key="lang.iso639_2" @click="select(lang)">
            {{ lang.iso639Name }} ({{ lang.iso639_2 }})
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import iso639List from '@/res/iso639List.json';
import { computed, defineComponent, PropType, ref } from 'vue';
import { capitalizeFirst } from '@/util/string';

export default defineComponent({
  props: {
    selected: {
      type: String as PropType<string>,
      required: true,
      default: ''
    },
    showLanguageSelection: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['update:selected', 'update:showLanguageSelection'],
  setup(props, { emit }) {
    const query = ref('');
    const input = ref<HTMLElement | null>(null);
    const showLanguageSelectionInternal = ref(false);
    const showLanguageSelection = computed<boolean>({
      get: () => showLanguageSelectionInternal.value,
      set: (val) => {
        emit('update:showLanguageSelection', val);
        showLanguageSelectionInternal.value = val;
        if (showLanguageSelectionInternal.value && input.value) {
          input.value.focus();
        }
      }
    });

    return {
      query,
      input,

      showLanguageSelection,
      showLanguageSelectionInternal,
      toggleShowLanguageSelection: (): void => {
        showLanguageSelection.value = !showLanguageSelection.value;
        emit('update:showLanguageSelection', showLanguageSelection.value);
      },

      languageList: computed(() => {
        if (query.value === '') {
          return iso639List;
        }
        const lowerCaseQuery = query.value.toLowerCase();
        return iso639List.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(lowerCaseQuery) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      }),
      select: ({ iso639_2 }): void => {
        showLanguageSelection.value = false;
        emit('update:selected', iso639_2);
      },
      prettySelected: computed(() => capitalizeFirst(props.selected)),
      clear: () => {
        query.value = '';
        input.value?.focus();
      }
    };
  }
});
</script>

<style scoped>
.search-toolbar--container--language--accordion {
  grid-template-areas:
    'search-bar'
    'space'
    'content';
  grid-template-rows: auto 8px 200px;
}

.slide-down-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-down-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
