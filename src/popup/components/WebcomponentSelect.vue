<template>
  <sl-select :label="label" hoist>
    <sl-menu>
      <InputField v-model="query" :placeholder="filterPlaceholder" placeholder-icon="filter"></InputField>
      <div v-for="(option, idx) in filteredOptions" :key="idx" :value="optionKey ? option[optionKey] : option" @click="$emit('update:selected', option)">
        <sl-menu-item :value="optionKey ? option[optionKey] : option">
          <slot :item="option"><span>{{ option }}</span></slot>
        </sl-menu-item>
      </div>
    </sl-menu>
  </sl-select>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { default as InputField } from '@/components/InputField.vue';

export default defineComponent({
  components: {
    InputField
  },
  props: {
    label: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
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
    options: {
      type: Array as PropType<any[]>,
      required: true
    },
    optionKey: {
      type: String as PropType<string | undefined>,
      required: false,
      default: undefined
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

      filteredOptions: computed(() => (query.value === '' ? props.options : props.filterFn(query.value))),
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
