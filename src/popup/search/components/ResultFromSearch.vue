<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-search--card">
    <div style="grid-row: 1/2; grid-column: 1/2" class="z-10 px-2 grid w-full h-full text-white result-from-search--card--hero--text">
      <div class="absolute flex font-medium top-2.5 right-2.5">
        <div class="text-xs flex align-center text-primary-color-700">
          <fa icon="times" class="h-icon-sm hover:cursor-pointer hover:text-destructive-icon" @click="remove" />
        </div>
      </div>
      <div style="grid-area: title" class="flex gap-2">
        <div class="font-header text-xl2 font-medium">{{ searchState.tmdb.title }}</div>
      </div>
      <div style="grid-area: subtitle" class="text-sm">
        {{ subHeader }}
      </div>
      <div style="grid-area: detail; grid-template-columns: auto 1fr; grid-column-gap: 0.5rem" class="grid w-full text-xs leading-relaxed">
        <div style="grid-column: 1 / 3">Rating</div>
        <div style="grid-column: 1 / 2" class="px-2">
          <a :href="tmdbLink" target="_blank" class="inline-flex gap-1 w-full text-primary-500 hover:text-primary-700 hover:underline">
            <span class="flex-grow">TMDb</span>
            <fa icon="external-link-alt" class="self-center h-icon-sm pb-1" />
          </a>
        </div>
        <div style="grid-column: 2 / 3" class="font-thin">{{ searchState.tmdb.vote_average }} / 10</div>
        <div style="grid-column: 1 / 2" class="px-2">
          <a :href="searchState.openSubtitle.websiteLink" target="_blank" class="inline-flex gap-1 w-full text-primary-500 hover:text-primary-700 hover:underline">
            <span class="flex-grow">Subtitle</span>
            <fa icon="external-link-alt" class="self-center h-icon-sm pb-1" />
          </a>
        </div>
        <div style="grid-column: 2 / 3" class="font-thin">{{ searchState.openSubtitle.rating }} / 10</div>
      </div>
    </div>
    <div class="relative" style="grid-area: header">
      <div>
        <img :src="searchState.tmdb.poster_path" class="w-full h-full object-cover rounded-t-lg" style="max-height: var(--image-height)" />
        <div class="w-full h-full absolute inset-0 rounded-t-lg bg-surface-900 bg-opacity-70" />
      </div>
    </div>
    <div style="grid-area: loading">
      <LoadingBar :loading="appState.state !== 'DONE'" :error="appState.state === 'ERROR'" class="w-full" />
    </div>
    <div style="grid-area: settings">
      <slot name="settings" />
    </div>
    <SuffixIconButton
      class="justify-end self-center px-4 flex"
      style="grid-area: actions"
      label="Highlight video"
      icon="crosshairs"
      @mouseenter="highlightCurrentVideo"
      @mouseleave="removeHighlightFromVideo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted } from 'vue';
import { capitalizeFirst } from '@/util/string';
import LoadingBar from '@/components/LoadingBar.vue';
import SuffixIconButton from '@/components/SuffixIconButton.vue';
import { useInjectStore } from '@/useInjectStore';

export default defineComponent({
  components: {
    LoadingBar,
    SuffixIconButton
  },
  emits: ['remove'],
  setup() {
    const appStore = useInjectStore('appStore');
    const searchStore = useInjectStore('searchStore');
    const subtitleStore = useInjectStore('subtitleStore');
    const videoStore = useInjectStore('videoStore');

    const mediaType = computed(() => capitalizeFirst(searchStore.state.value?.tmdb?.media_type));
    const releaseDate = computed(() => searchStore.state.value.tmdb?.release_date.substr(0, 4) ?? null);

    onUnmounted(() => {
      videoStore.actions.removeHighlight();
    });

    return {
      appState: appStore.state,
      searchState: searchStore.state,
      remove: () => {
        appStore.actions.reset();
        searchStore.actions.reset();
        subtitleStore.actions.reset();
        videoStore.actions.removeCurrent();
      },
      highlightCurrentVideo: () => videoStore.actions.highlight({ video: videoStore.getters.current.value }),
      removeHighlightFromVideo: videoStore.actions.removeHighlight,
      subHeader: computed(() => `${mediaType.value} ${releaseDate.value ? `/ ${releaseDate.value}` : ''}`),
      tmdbLink: computed(() => `https://www.themoviedb.org/${searchStore.state.value?.tmdb?.media_type}/${searchStore.state.value.tmdb?.tmdb_id}`)
    };
  }
});
</script>
<style scoped>
.result-from-search--card {
  --image-height: 150px;
  grid-template-areas:
    'header  '
    'loading '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: var(--image-height) 1px auto 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}

.result-from-search--card--hero--text {
  grid-template-areas:
    '.        .        .       .'
    'title    title    .       .'
    'subtitle subtitle .       .'
    '.        .        .       .'
    'detail   detail   .       .'
    '.        .        .       .';
  grid-template-rows: 8px auto auto 1fr auto 8px;
  grid-template-columns: 4px 1fr auto 4px;
}
</style>
