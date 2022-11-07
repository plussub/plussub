<template>
  <Select
    :selected="selected"
    :show="show"
    :options="internalList"
    filter-placeholder="Filter languages"
    class="px-2 mt-2"
    @hovered='(o) => hovered = o'
    @update:selected="$emit('update:selected', $event)"
    @update:show="$emit('update:show', $event)"
    @filter='(query) => internalList = list.filter(({ language_name, language_code }) => language_name.toLowerCase().startsWith(query.toLowerCase()) || language_code.toLowerCase().startsWith(query.toLowerCase()))'
  >
    <template #currentSelected="{show:expanded}">
      <span>Subtitle language:
        <span v-if='expanded && hovered' :class="{ 'text-primary-700': expanded, 'font-medium': expanded }">{{ hovered.language_name }} ({{ hovered.language_code }})</span>
        <span v-else :class="{ 'text-primary-700': expanded, 'font-medium': expanded }">{{ selected.language_name }} ({{ selected.language_code }})</span>
      </span>
    </template>
    <template #default="{item}">
      <span>{{ item.language_name}} ({{ item.language_code }})</span>
    </template>
  </Select>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { default as Select } from '@/components/Select.vue';
import { useStringFn } from '@/composables';
import { ContentLanguage } from '@/language/store/listContentLanguagesQuery';

export default defineComponent({
  components: {
    Select
  },
  props: {
    list: {
      type: Array as PropType<ContentLanguage[]>,
      default: () => []
    },
    selected: {
      type: Object as PropType<ContentLanguage>,
      required: true
    },
    show: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
  },
  emits: ['update:selected', 'update:show'],
  setup(props) {
    const {capitalize} = useStringFn();
    const internalList = ref(props.list);
    const hovered = ref(null)
    return {
      hovered,
      internalList,
      capitalize
    };
  }
});
</script>