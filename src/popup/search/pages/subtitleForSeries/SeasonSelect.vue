<template>
  <Select
      :selected="selected"
      :show="show"
      :options="seasonList"
      :filter-fn="filter"
      filter-placeholder="Filter episodes"
      class="px-2 mt-2"
      @update:selected="$emit('update:selected', $event)"
      @update:show="$emit('update:show', $event)"
  >
    <template #currentSelected>
      <span>Season {{ selected }}</span>
    </template>
  </Select>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, watch} from 'vue';
import { default as Select } from '@/components/Select.vue';

export default defineComponent({
  components: {
    Select
  },
  props: {
    selected: {
      type: Number as PropType<number>,
      required: true
    },
    show: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    count: {
      type: Number as PropType<number>,
      required: true
    }
  },
  emits: ['update:selected', 'update:show'],
  setup(props, {emit}) {
    const seasonList = computed(() => Array.from({ length: props.count }).map((_, index) => index + 1));
    watch(() => props.count, () => {
      if(props.count < props.selected){
        emit('update:selected', 0)
      }
    });
    return {
      seasonList,
      filter: (query: string) => seasonList.value.filter((e) => e.toString() === query.toString()),
    };
  }
});
</script>
