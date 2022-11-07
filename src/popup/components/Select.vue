<template>
  <div class="relative w-full">
    <div class="flex rounded border px-2 pt-2 pb-1" :class="{ 'border-primary-500': show, ring: show, 'ring-primary-700': show, 'ring-opacity-50': show }" style="background-color: white">
      <a class="flex-grow" @click="toggleShow">
        <slot name="currentSelected" :show="show">
          <span :class="{ 'text-primary-700': show, 'font-medium': show }"> Current selected: {{ selected }}</span>
        </slot>
      </a>
      <span v-if="show">
        <a @click="toggleShow">
          <FontAwesomeIcon icon="chevron-up" class="h-icon text-primary-700" />
        </a>
      </span>
      <span v-else>
        <a @click="toggleShow">
          <FontAwesomeIcon icon="chevron-down" class="h-icon" />
        </a>
      </span>
    </div>

    <transition name="slide-select">
      <div v-show="show" class="absolute mt-1 inset-x-0 inset-y-full z-30 grid h-0 w-full bg-primary-50 shadow search-toolbar--container--select">
        <div style="grid-column: 1 / -1; grid-row: 1 / 2" class="bg-primary-50"></div>
        <div class="w-full pt-1" style="grid-area: filter-bar">
          <InputField v-model="query" :placeholder="filterPlaceholder" placeholder-icon="filter" />
        </div>
        <div style="grid-area: space" class="bg-surface-50 text-on-surface-50 border-l border-r border-primary-700">&nbsp;</div>
        <transition name="slide-select" appear>
          <div
            v-show="show"
            class="overflow-y-auto overflow-x-hidden bg-surface-50 text-on-surface-50 z-10 shadow-lg border-l border-r border-b rounded-b border-primary-700"
            style="grid-area: content"
          >
            <div
              v-for="(option, idx) in options"
              :key="idx" class="w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer font-lg p-2"
              @click="select(option)"
              @mouseenter="$emit('hovered', option)"
              @mouseleave="$emit('hovered', null)">
              <slot :item="option"><span>{{ option }}</span></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import InputField from './InputField.vue';
import FontAwesomeIcon from './FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon,
    InputField
  },
  props: {
    selected: {
      type: [String, Number, Object] as PropType<unknown>,
      required: true,
      default: ''
    },
    filterPlaceholder: {
      type: String as PropType<string>,
      required: true,
      default: ''
    },
    filterFn: {
      type: Function as PropType<(query: string) => unknown[]>,
      required: false,
      default: () => true
    },
    show: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    options: {
      type: Array as PropType<unknown[]>,
      required: true
    }
  },
  emits: ['update:selected', 'update:show', 'hovered', 'filter'],
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

    watch(query, (query) => emit("filter", query));

    return {
      query,
      input,
      showInternal,
      toggleShow: (): void => {
        emit('update:show', !showInternal.value);
      },
      select: (option): void => {
        showInternal.value = false;
        emit('update:selected', option);
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
.search-toolbar--container--select {
  grid-template-areas:
    '. filter-bar .'
    '. space .'
    '. content .';
  grid-template-rows: auto 8px 200px;
  grid-template-columns: 8px 1fr 8px;
}

.slide-select-enter-active,
.slide-select-leave-active {
  transition: all 0.5s ease;
  max-height: 200px;
}

.slide-select-enter-from,
.slide-select-leave-to {
  max-height: 0;
}
</style>
