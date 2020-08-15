<template>
  <div class="knopf-group"
       style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px;">
    <spinner v-show="loading && query"
             style="grid-area: bar; justify-self: end; align-self: center; font-size: 12px; margin-right: 12px;"/>
    <input ref="inputRef"
           v-on:keydown.prevent="onKeydown"
           autofocus
           style="grid-area: bar;"
           placeholder="Search movie or series"
           id="search"
           type="text"
           v-model="query"/>
    <a class="knopf flat pill sharp buttonOnPrimary" style="grid-area: button; width: 40px;"><i
        class="fa fa-search fa-lg"></i></a>
  </div>
</template>

<script>
import {ref, watch} from 'vue';
import {debounce} from '@/composables';
import {searchRequest} from '@/search/searchRequest';
import Spinner from '@/components/Spinner';
import {useKeydownPreventInputHandler} from '@/composables';

export default {
  components: {
    Spinner
  },
  props: {
    query: String,
    loading: Boolean
  },
  setup(props, {emit}) {
    const query = ref(props.query);

    const {fn: req, result: queryResult, loading} = debounce({
      fn: searchRequest,
      timeout: 1500
    });

    watch(query, (query) => {
          emit('update:query', query);
          return req(query);
        },
        {
          immediate: true
        }
    );

    watch(loading, (loading) => emit('update:loading', loading), {immediate: true});
    watch(queryResult, (result) => emit('update:searchResults', result?.data?.videoSearch?.entries ?? []));

    const inputRef = ref(null);

    return {
      query,
      queryResult,
      loading,
      props,
      inputRef,
      onKeydown: useKeydownPreventInputHandler({
        allowedInputValue: /^[0-9a-zA-Z _]$/,
        inputRef,
        valueRef: query
      })
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
