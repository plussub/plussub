<template>
  <textarea
      v-model="excerpt"
      disabled
      class="mx-2 rounded focus:border-primary-500 focus:ring focus:ring-primary-700 focus:ring-opacity-50 text-xs font-medium box-border resize-none"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { computed } from '@vue/reactivity';
import { subtitleState } from '@/subtitle/state';
import Duration from 'luxon/src/duration';

export default defineComponent({
  setup() {
    const parsedPartial = computed(() => (subtitleState.value.withOffsetParsed.length > 5 ? subtitleState.value.withOffsetParsed.slice(0, 5) : subtitleState.value.withOffsetParsed));

    return {
      excerpt: computed(() =>
        parsedPartial.value
          .map(({ from, to, text }, i) => `${i + 1}\n${Duration.fromMillis(from).toFormat('hh:mm:ss.SSS')} --> ${Duration.fromMillis(to).toFormat('hh:mm:ss.SSS')}\n${text}\n`)
          .join('\n')
      )
    };
  }
});
</script>
