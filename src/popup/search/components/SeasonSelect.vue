<template>
  <Select
      :selected="selected"
      :show="show"
      :options="internalList"
      filter-placeholder="Filter episodes"
      class="px-2 mt-2"
      @hovered='(o) => hovered = o'
      @update:selected="$emit('update:selected', $event)"
      @update:show="$emit('update:show', $event)"
      @filter='(q) => query = q'
  >
    <template #currentSelected="{show:expanded}">
      <span>Season
        <span :class="{ 'text-primary-700': expanded, 'font-medium': expanded }">{{ hovered ?? selected }}</span>
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
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
    const query = ref("");

    watch(() => props.count, () => {
      if(props.count < props.selected){
        emit('update:selected', 0)
      }
    });

    const hovered = ref(null)

    const internalList = computed(() => {
      if(query.value.trim() === ""){
        return seasonList.value;
      }
      return seasonList.value.filter((e) => e.toString() === query.value.toString());
    });

    return {
      query,
      hovered,
      internalList,
    };
  }
});
</script>
