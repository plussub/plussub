<template>
  <div class="relative w-full">
    <div class="flex">
      <a class="flex-grow" :class="{ 'text-primary-700': show, 'font-medium': show }" @click="toggleShow">
        <slot name="currentSelected">
          <span> Current selected: {{ selected }}</span>
        </slot>
      </a>
      <span v-if="show">
        <a @click="toggleShow">
          <fa icon="chevron-up" class="h-icon text-primary-700" />
        </a>
      </span>
      <span v-else>
        <a @click="toggleShow">
          <fa icon="chevron-down" class="h-icon" />
        </a>
      </span>
    </div>

    <transition name="slide-accordion">
      <div v-show="show" class="absolute mt-1 inset-x-0 inset-y-full z-30 grid h-0 w-full bg-primary-50 shadow search-toolbar--container--accordion">
        <div style="grid-column: 1 / -1; grid-row: 1 / 2" class="bg-primary-50"></div>
        <div class="w-full pt-1" style="grid-area: filter-bar">
          <InputField v-model="query" :placeholder="filterPlaceholder" placeholder-icon="filter" />
        </div>
        <div style="grid-area: space" class="bg-surface-50 text-on-surface-50 border-l border-r border-primary-700">&nbsp;</div>
        <transition name="slide-accordion" appear>
          <div
            v-show="show"
            class="overflow-y-auto overflow-x-hidden bg-surface-50 text-on-surface-50 z-10 shadow-lg border-l border-r border-b rounded-b border-primary-700"
            style="grid-area: content"
          >
            <div v-for="(item, idx) in filteredItems" :key="idx" class="w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer font-lg p-2" @click="select(item)">
              <slot :item="item"><span>{{ item }}</span></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { default as InputField } from '@/components/InputField.vue';

export default defineComponent({
  components: {
    InputField
  },
  props: {
    selected: {
      type: [String, Number, Object] as PropType<any>,
      required: true,
      default: ''
    },
    filterPlaceholder: {
      type: String as PropType<string>,
      required: true,
      default: ''
    },
    filterFn: {
      type: Function as PropType<(query: string) => any[]>,
      required: true
    },
    show: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    items: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  emits: ['update:selected', 'update:show'],
  setup(props, { emit }) {
    const query = ref('');
    const input = ref<HTMLElement | null>(null);
    const showInternal = computed<boolean>({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val);
        if (val && input.value) {
          input.value.focus();
        }
      }
    });

    return {
      query,
      input,
      showInternal,
      toggleShow: (): void => {
        emit('update:show', !showInternal.value);
      },

      filteredItems: computed(() => (query.value === '' ? props.items : props.filterFn(query.value))),
      select: (item): void => {
        showInternal.value = false;
        emit('update:selected', item);
      },
      clear: () => {
        query.value = '';
        input.value?.focus();
      }
    };
  }
});
</script>

<style scoped>
.search-toolbar--container--accordion {
  grid-template-areas:
    '. filter-bar .'
    '. space .'
    '. content .';
  grid-template-rows: auto 8px 200px;
  grid-template-columns: 8px 1fr 8px;
}

.slide-accordion-enter-active,
.slide-accordion-leave-active {
  transition: all 0.5s ease;
  max-height: 200px;
}

.slide-accordion-enter-from,
.slide-accordion-leave-to {
  max-height: 0;
}
</style>
