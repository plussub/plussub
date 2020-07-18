<template>
  <template v-if="dataReady">
    <div class="subtitle-selection-content--container">
      <div style="grid-area: search-results; display: flex; flex-wrap: wrap;">
        <div v-for="item in state.entries" class="subtitle-selection-content--container--card" style="grid-area: search-results;">
          <div style="grid-area: card-header;">{{ item.SubFileName }}</div>
          <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
            {{ item.SubRating }}
            {{ item.ZipDownloadLink }}
          </div>
          <div style="grid-area: card-divider; align-self: end;">
            <divider />
          </div>
          <div style="grid-area: card-action; justify-self: end;">
            <a class="knopf flat block end small" style="width: 100%;" @click="select(item)">Select</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div>Loading subtitles...</div>
  </template>
</template>

<script>
import { searchRequest } from '@/subtitleSelection/searchRequest';
import { reactive, ref } from 'vue';
import Divider from '@/components/Divider';

export default {
  components: {
    Divider
  },
  props: {
    tmdbId: String,
    mediaType: String
  },
  setup(props) {
    let dataReady = ref(false);
    const state = reactive({ entries: [] });
    dataReady.value = searchRequest({ ...props, language: 'en' }).then((result) => {
      dataReady.value = true;
      console.warn(result);
      state.entries = result.data.subtitleSearch.entries;
    });

    return {
      dataReady,
      state,
      props
    };
  }
};
</script>
<style scoped>
.subtitle-selection-content--container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. search-results .'
    '. spacer .';
  grid-template-rows: auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
}

.subtitle-selection-content--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  grid-template-areas:
    'card-header card-header card-header'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: var(--image-height) 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  margin-bottom: 8px;
}
</style>
