<template>
  <div
    class="flex flex-col hover:cursor-pointer"
    :class="{ 'text-sub-text-on-surface-50': !onlyHearingImpaired, 'text-primary-700': onlyHearingImpaired, 'font-medium': onlyHearingImpaired }"
    @click="$emit('update:onlyHearingImpaired', !onlyHearingImpaired)"
  >
    <FontAwesomeIcon icon="deaf" class="h-icon-sm" />
    <div class="text-sm">only</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    onlyHearingImpaired: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['update:onlyHearingImpaired']
});
</script>
