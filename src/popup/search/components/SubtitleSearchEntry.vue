<template>
  <div class="grid w-full hover:bg-primary-700 hover:text-on-primary-700 hover:cursor-pointer subtitle-selection-content--container--card py-2" @click="select(item)">
    <div class="font-header font-medium text-xl one-line" style="grid-area: header">
      {{ item.attributes.files[0].file_name }}
    </div>
    <div class="grid w-full text-xs font-light leading-relaxed pl-2" style="grid-area: content; grid-template-columns: auto 1fr auto 1fr auto 1fr; grid-column-gap: 8px;">
      <div style="grid-column: 1 / 2;" class="font-medium">Rating</div>
      <div style="grid-column: 2 / 3" >{{ item.attributes.ratings }}</div>
      <div v-if="item.attributes.hearing_impaired" style="grid-column: 3 / 4;" class="font-medium" title="Hearing impaired">
        <FontAwesomeIcon icon="deaf" class="h-icon-sm" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SubtitleSearchResultData } from '@/search/__gen_gql';
import { defineComponent, PropType } from 'vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    item: {
      type: Object as PropType<SubtitleSearchResultData>,
      required: true
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    return {
      select: (selected) => emit('select', selected)
    };
  }
});
</script>

<style scoped>
.subtitle-selection-content--container--card {
  grid-template-areas:
    '. header  .'
    '. .       .'
    '. content .';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: 8px 1fr 4px;
}
</style>
