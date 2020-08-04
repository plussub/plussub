<template>
  <div class="knopf-group" style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px;">
    <spinner v-show="loading && state.query" style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px;" />
    <input autofocus style="grid-area: bar;" placeholder="Search movie or series" id="search" type="text" v-model="state.query" />
    <a class="knopf flat pill small sharp buttonOnPrimary" style="grid-area: button; width: 40px;"><i class="fa fa-search fa-sm"></i></a>
  </div>
</template>

<script>
import { reactive, watch, watchEffect } from 'vue';
import { debounce } from '@/composables';
import { searchRequest } from '@/search/searchRequest';
import Spinner from '@/components/Spinner';

export default {
  components: {
    Spinner
  },
  props: {
    query: String,
    loading: Boolean
  },
  setup(props, { emit }) {
    const state = reactive({ query: props.query });
    const { fn: req, result: queryResult, loading } = debounce({
      fn: searchRequest,
      timeout: 1500
    });

    watch(
      () => state.query,
      (query) => {
        emit('update:query', query);
        return req(query);
      },
      {
        immediate: true
      }
    );

    watch(loading, (loading) => emit('update:loading', loading), {immediate: true});
    watch(queryResult, (result) => emit('on-search-results', result?.data?.videoSearch?.entries ?? []));

    return {
      state,
      queryResult,
      loading,
      props
    };
  }
};
</script>

<style>/* plussub header */
.knopf-group.search-bar--container {
  display: grid;
  grid-template-areas: 'bar button';
  grid-template-columns: 1fr auto;
}
</style>
