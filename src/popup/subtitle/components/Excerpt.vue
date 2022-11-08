<template>
  <div class="overflow-y-auto">
    <div v-for="(item,idx) in excerpt" :key="idx">
      <div class="mt-4 text-xs font-medium flex items-center">
        <slot name="from" :from="item.from"></slot>
        <FontAwesomeIcon icon="arrow-right" class="mr-2 h-icon-sm inline-block" />
        <slot name="to" :to="item.to"></slot>
      </div>
      <div class="text-xs text-sub-text-on-surface-50">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { SubtitleEntry } from '@/subtitle/store';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    excerpt: {
      type: Array as PropType<SubtitleEntry[]>,
      default: () => []
    }
  }
});
</script>
