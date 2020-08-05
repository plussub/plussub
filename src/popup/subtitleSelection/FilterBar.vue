<template>
  <div class="knopf-group" style="display: flex;">
    <input autofocus style="flex-grow: 1;" placeholder="Filter subtitle result" id="search" type="text" v-model="state.filter" />
    <a ref="draggableAreaRef" class="knopf flat pill sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-filter fa-lg"></i></a>
  </div>
</template>

<script>
import { reactive, watch, ref} from 'vue';
import {useDraggableArea} from "@/composables";

export default {
  props: {
    filter: String
  },
  setup(props, { emit }) {
    const state = reactive({ filter: props.filter });
    const draggableAreaRef = ref(null);
    useDraggableArea({draggableAreaRef});

    watch(
      () => state.filter,
      (filter) => {
        emit('update:filter', filter);
      }
    );

    return {
      draggableAreaRef,
      state,
      props
    };
  }
};
</script>
