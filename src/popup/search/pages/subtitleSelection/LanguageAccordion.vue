<template>
  <div class="relative w-full">
    <div class="flex">
      <a class="flex-grow" :class="{ 'text-primary-700': showLanguageSelection, 'font-medium': showLanguageSelection }" @click="toggleShowLanguageSelection"> Subtitle language: {{ prettySelected }} </a>
      <span v-if="showLanguageSelection">
        <a @click="toggleShowLanguageSelection">
          <fa icon="chevron-up" class="h-icon text-primary-700" />
        </a>
      </span>
      <span v-else>
        <a @click="toggleShowLanguageSelection">
          <fa icon="chevron-down" class="h-icon" />
        </a>
      </span>
    </div>

    <transition name="slide-language-accordion">
      <div v-show="showLanguageSelection" class="absolute mt-1 inset-x-0 inset-y-full z-30 grid h-0 w-full bg-primary-50 shadow search-toolbar--container--language--accordion">
        <div style="grid-column: 1 / -1; grid-row: 1 / 2" class="bg-primary-50"></div>
        <div class="w-full pt-1"  style="grid-area: filter-bar;">
          <InputField v-model="query" placeholder="Filter languages" placeholder-icon="filter"/>
        </div>
        <div style="grid-area: space" class=" bg-surface-50 text-on-surface-50 border-l border-r border-primary-700">&nbsp;</div>
        <transition name="slide-language-accordion" appear>
          <div
            v-show="showLanguageSelection"
            class="overflow-y-auto overflow-x-hidden bg-surface-50 text-on-surface-50 z-10 shadow-lg border-l border-r border-b rounded-b border-primary-700"
            style="grid-area: content"
          >
            <div v-for="lang in languageList" class="w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer font-lg p-2" :key="lang.iso639_2" @click="select(lang)">
              {{ lang.iso639Name }} ({{ lang.iso639_2 }})
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import iso639List from '@/res/iso639List.json';
import { computed, defineComponent, PropType, ref } from 'vue';
import { capitalizeFirst } from '@/util/string';
import { default as InputField } from "@/components/InputField.vue";

export default defineComponent({
  components: {
    InputField
  },
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
    const showLanguageSelectionInternal = computed<boolean>({
      get: () => props.showLanguageSelection,
      set: (val) => {
        emit('update:showLanguageSelection', val);
        if (val && input.value) {
          input.value.focus();
        }
      }
    });

    return {
      query,
      input,
      showLanguageSelectionInternal,
      toggleShowLanguageSelection: (): void => {
        emit('update:showLanguageSelection', !showLanguageSelectionInternal.value);
      },

      languageList: computed(() => {
        if (query.value === '') {
          return iso639List;
        }
        const lowerCaseQuery = query.value.toLowerCase();
        return iso639List.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(lowerCaseQuery) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      }),
      select: ({ iso639_2 }): void => {
        showLanguageSelectionInternal.value = false;
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
    '. filter-bar .'
    '. space .'
    '. content .';
  grid-template-rows: auto 8px 200px;
  grid-template-columns: 8px 1fr 8px;
}

.slide-language-accordion-enter-active,
.slide-language-accordion-leave-active {
  transition: all 0.5s ease;
  max-height: 200px;
}

.slide-language-accordion-enter-from,
.slide-language-accordion-leave-to {
  max-height: 0;
}
</style>
