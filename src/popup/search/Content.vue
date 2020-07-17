<template>
  <div class="search-content--container">
    <div style="grid-area: search-results; display: flex; flex-wrap: wrap;">
      <div v-show="state.entries.length === 0" style="width: 100%;">
        After a search, the results are displayed here.
      </div>
      <div v-for="item in state.entries" class="search-content--container--card">
        <div style="grid-area: card-header; position: relative;">
          <div class="search-content--container--card--hero">
            <img :src="item.poster_path ?? posterFallback" style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;" />
          </div>
          <div style="position: absolute; color: white; top: 8px; left: 16px; width: calc(100% - 32px);">
            <div style="font-family: var(--card-header-font-family); width: 100%; display: flex; justify-content: space-between;">
              <span>
                <div style="font-size: var(--card-header-font-size);">
                  {{ item.title }}
                </div>
                <div style="font-size: 0.75em;">({{ item.media_type }} {{ item.release_date }})</div>
              </span>
            </div>
          </div>
          <div style="font-size: 0.75em; position: absolute; bottom: 12px; right: 16px; color: white;">
            <div>tmdb: {{ item.vote_average }}</div>
          </div>
        </div>
        <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
          {{ item.overview }}
        </div>
        <div style="grid-area: card-divider; align-self: end;">
          <divider />
        </div>
        <div style="grid-area: card-action; justify-self: end;">
          <a class="knopf flat block end small" style="width: 100%;" @click="select(item)">Select</a>
        </div>
      </div>
    </div>
    <div style="grid-area: spacer;">&nbsp;</div>
  </div>
</template>

<script>
import { useEventBusListener } from '@/composables';
import { reactive } from 'vue';
import posterFallback from '@/res/posterFallback.png';
import Divider from '@/components/Divider';

export default {
  components: {
    Divider
  },
  setup() {
    const state = reactive({ entries: [] });
    useEventBusListener('searchResult', (entries) => {
      state.entries = entries;
    });

    return {
      state,
      posterFallback,
      useEventBusListener,
      select({ id, media_type }) {
        console.warn(id);
        this.$router.replace({ name: 'subtitleSelection', params: { tmdbId: id, mediaType: media_type } });
      }
    };
  }
};
</script>

<style scoped>
.search-content--container {
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

.search-content--container--card {
  --image-height: 120px;
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

.search-content--container--card--hero::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.62);
  opacity: 1;
}

.search-content--container--entry {
  width: 100%;
  box-shadow: var(--card-shadow);
  margin-bottom: 8px;
  display: grid;
  grid-template-areas:
    'poster . .'
    'poster . title'
    'poster . content'
    'poster . action';
  grid-template-rows: 8px auto max(4em) auto;
  grid-template-columns: 120px 8px 1fr;
}
</style>
