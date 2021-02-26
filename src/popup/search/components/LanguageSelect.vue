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
import { computed, defineComponent, PropType, ref } from 'vue';
import { default as Select } from '@/components/Select.vue';
import { capitalizeFirst } from '@/util/string';
import languageList from '@/res/iso639List.json';

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
    }
  },
  emits: ['update:selected', 'update:show'],
  setup(props) {
    return {
      languageList,
      filter: (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        return languageList.filter(({ iso639Name, iso639_2 }) => iso639Name.toLowerCase().startsWith(query) || iso639_2.toLowerCase().startsWith(lowerCaseQuery));
      },
      pretty: computed(() => capitalizeFirst(props.selected.iso639_2))
    };
  }
});
</script>
