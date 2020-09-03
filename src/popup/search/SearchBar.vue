<template>
  <div class="knopf-group"
       style="display: grid; grid-template-areas: 'bar button'; grid-template-columns: 1fr auto; grid-template-rows: 30px;">
    <spinner v-show="loadingRef && query"
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
import {ref, watch, computed} from 'vue';
import {debounce} from '@/composables';
import {searchRequest} from '@/search/searchRequest';
import Spinner from '@/components/Spinner';
import {useKeydownPreventInputHandler} from '@/composables';

export default {
  components: {
    Spinner
  },
  emits: ['update:searchResults', 'update:loading', 'update:query'],
  props: {
    query: String,
    loading: Boolean,
    searchResults: Array
  },
  setup(props, {emit}) {
    const searchResults = computed({
      get: () => props.searchResults,
      set: (val) => {
        emit('update:searchResults', val?.data?.videoSearch?.entries ?? [])
      }
    })
    const loadingRef = computed({
      get: () => props.loading,
      set: (val) => emit('update:loading', val)
    })

    const {fn: req} = debounce({
      fn: searchRequest,
      timeout: 1500,
      resultRef: searchResults,
      loadingRef
    });

    const query = computed({
      get: () => props.query,
      set: (val) => emit('update:query', val)
    });
    watch(query, (query) => req(query), {immediate: true});

    const inputRef = ref(null);

    return {
      query,
      loadingRef,
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
