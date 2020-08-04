<template>
  <div class="knopf-group" style="display: flex;">
    <input autofocus style="flex-grow: 1;" placeholder="Filter subtitle result" id="search" type="text" v-model="state.filter" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-filter fa-sm"></i></a>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';

export default {
  props: {
    filter: String
  },
  setup(props, { emit }) {
    const state = reactive({ filter: props.filter });

    watch(
      () => state.filter,
      (filter) => {
        emit('update:filter', filter);
      }
    );

    return {
      state,
      props
    };
  }
};
</script>
