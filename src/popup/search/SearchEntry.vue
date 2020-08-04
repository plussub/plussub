<template>
  <div class="search-content--container--card">
    <div style="grid-area: card-header; position: relative;">
      <div class="search-content--container--card--hero">
        <img :src="props.item.poster_path ?? static.posterFallback" style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;" />
      </div>
      <div style="position: absolute; color: white; top: 8px; left: 16px; width: calc(100% - 32px);">
        <div style="font-family: var(--card-header-font-family); width: 100%; display: flex; justify-content: space-between;">
          <span>
            <div style="font-size: var(--card-header-font-size);">
              {{ props.item.title }}
            </div>
            <div style="font-size: 0.75em;">({{ item.media_type }} {{ item.release_date }})</div>
          </span>
        </div>
      </div>
      <div style="font-size: 0.75em; position: absolute; bottom: 12px; right: 16px; color: white;">
        <div>tmdb: {{ props.item.vote_average }}</div>
      </div>
    </div>
    <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
      {{ props.item.overview }}
    </div>
    <div style="grid-area: card-divider; align-self: end;">
      <divider />
    </div>
    <div style="grid-area: card-action; justify-self: end;">
      <a class="knopf flat block end small" style="width: 100%;" @click="select(item)">Select</a>
    </div>
  </div>
</template>

<script>
import posterFallback from '@/res/posterFallback.png';
import Divider from '@/components/Divider';

export default {
  components: {
    Divider
  },
  props: {
    item: Object
  },
  setup(props) {
    return {
      static: {
        posterFallback
      },
      props,
      select(selected) {
        this.$emit('select', selected);
      }
    };
  }
};
</script>
<style scoped>/* plussub header */
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
</style>
