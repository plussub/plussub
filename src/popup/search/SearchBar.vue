<template>
  <div class="knopf-group" style="display: flex;">
    <input style="flex-grow: 1;" placeholder="Search movie or series" id="search" type="text" v-model="state.query" />
    <a class="knopf flat pill small sharp buttonOnPrimary" style="width: 40px;"><i class="fa fa-search fa-sm"></i></a>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
import { debounce } from '@/composables';
import { searchRequest } from '@/search/searchRequest';

export default {
  props: {
    query: String
  },
  setup(props, { emit }) {
    const state = reactive({ queryResult: {}, query: props.query });
    const req = debounce({
      fn: searchRequest,
      timeout: 1500,
      cb: (result) => (state.queryResult = result)
    });

    watch(
      () => state.query,
      (query) => {
        emit('update:query', query);
        return req(query);
      }
    );
    watch(
      () => state.queryResult,
      (result) => emit('on-search-results', result?.data?.videoSearch?.entries ?? [])
    );

    return {
      state,
      props
    };
  }
};
</script>
