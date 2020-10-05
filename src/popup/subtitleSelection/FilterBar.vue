<template>
  <div class="knopf-group" style="display: flex;">
    <input ref="inputRef"
           v-on:keydown.prevent="onKeydown"
           autofocus
           style="flex-grow: 1;"
           placeholder="Filter subtitle result"
           id="search"
           type="text"
           v-model="filter" />
    <a class="knopf flat pill sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-filter fa-lg"></i></a>
  </div>
</template>

<script>
import {ref, computed} from 'vue';
import {useKeydownPreventInputHandler} from '@/composables';

export default {
  props: {
    filter: String
  },
  emits: ['update:filter'],
  setup(props, { emit }) {
    const filter = computed({
      get: () => props.filter,
      set: (val) => emit('update:filter', val)
    });
    const inputRef = ref(null);

    return {
      inputRef,
      filter,
      onKeydown: useKeydownPreventInputHandler({
        allowedInputValue: /^[0-9a-zA-Z _]$/,
        inputRef,
        valueRef: filter
      })
    };
  }
};
</script>
