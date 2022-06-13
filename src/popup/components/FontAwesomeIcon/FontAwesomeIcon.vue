<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="$props.class" :viewBox="`0 0 ${width} ${height}`">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
    <path fill="currentColor" :d="svgPath" />
  </svg>
</template>
<script>
import { defineComponent, computed } from 'vue';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

export default defineComponent({
  name: 'FontAwesomeIcon',

  props: {
    icon: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'fas',
      required: false
    },
    class: {
      type: String,
      default: '',
      required: false
    }
  },

  setup(props) {
    const localDefinition = {
      caption: {
        prefix: 'locale',
        iconName: 'caption',
        icon: [24, 24, [], '', ['M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z']]
      }
    };

    const definition = computed(() => {
      if (props.type === 'local') {
        return localDefinition[props.icon];
      }

      return findIconDefinition({
        prefix: props.type,
        iconName: props.icon
      });
    });
    const width = computed(() => definition.value.icon[0]);
    const height = computed(() => definition.value.icon[1]);
    const svgPath = computed(() => definition.value.icon[4]);

    return { width, height, svgPath };
  }
});
</script>
