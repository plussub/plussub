<template>
  <Select
    :selected="selected"
    :show="show"
    :options="languageList"
    filter-placeholder="Filter languages"
    :filter-fn="filter"
    class="px-2 mt-2"
    @update:selected="$emit('update:selected', $event)"
    @update:show="$emit('update:show', $event)"
  >
    <template #currentSelected>
      <span>Subtitle language: {{ pretty }}</span>
    </template>
    <template #default="slotProps">
      <span>{{ slotProps.item.iso639Name }} ({{ slotProps.item.iso639_2 }})</span>
    </template>
  </Select>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { default as Select } from '../Select.vue';
import languageList from './iso639List.json';

const capitalizeFirst = (str: string | undefined): string => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}` : '');

export default defineComponent({
  components: {
    Select
  },
  props: {
    selected: {
      type: Object as PropType<{ iso639_2: string; iso639Name: string }>,
      required: true
    },
    show: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    filterList: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  emits: ['update:selected', 'update:show'],
  setup(props) {
    return {
      languageList: languageList.filter(({ iso639_2 }) => props.filterList.length > 0 ? props.filterList.includes(iso639_2) : true),
      filter: (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        return languageList.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(query) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      },
      pretty: computed(() => capitalizeFirst(props.selected.iso639_2))
    };
  }
});
</script>
