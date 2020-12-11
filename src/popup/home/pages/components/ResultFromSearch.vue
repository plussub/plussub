<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-search--card">
    <div style="grid-row: 1/2; grid-column: 1/2;" class="z-10 px-2 grid w-full h-full text-white result-from-search--card--hero--text">
      <div class="absolute flex font-medium top-2.5	right-2.5">
        <div class="text-xs mr-1">{{ prettyState }}</div>
        <div class="text-xs flex align-center">
          <transition name="fade" mode="out-in">
            <Spinner v-if="state !== 'DONE'" />
            <fa v-else icon="check" class="h-icon-sm" />
          </transition>
        </div>
      </div>
      <div style="grid-area: title;" class="font-header text-xl2 font-medium">{{ searchState.tmdb.title }}</div>
      <div style="grid-area: subtitle;" class="text-sm">
        {{ prettyMediaType }}
        {{ searchState.tmdb.release_date ? '/ ' + searchState.tmdb.release_date.substr(0, 4) : '' }}
      </div>
      <div style="grid-area: detail; grid-template-columns: auto 1fr; grid-column-gap: 16px;" class="grid w-full text-xs leading-relaxed">
        <div style="grid-column: 1 / 2">Rating</div>
        <div style="grid-column: 2 / 3" class="font-thin">{{ searchState.openSubtitle.SubRating }}</div>
        <div style="grid-column: 1 / 2">Format</div>
        <div style="grid-column: 2 / 3" class="font-thin">{{ searchState.openSubtitle.SubFormat }}</div>
        <div style="grid-column: 1 / 2">Language</div>
        <div style="grid-column: 2 / 3" class="font-thin">{{ searchState.openSubtitle.LanguageName }}</div>
      </div>
      <div style="grid-area: detail2;" class="text-xs self-end">
        <div><span class="mr-2">tmdb</span><span class="font-thin">{{ searchState.tmdb.vote_average }}</span></div>
      </div>
    </div>
    <div class="relative" style="grid-area: header;">
      <div>
        <img
          :src="searchState.tmdb.poster_path"
          class="w-full h-full object-cover rounded-t-lg"
          style="max-height: var(--image-height);"
        />
        <div class="w-full h-full absolute inset-0 rounded-t-lg bg-surface-900 bg-opacity-70"/>
      </div>
    </div>
    <div class="px-4 w-full" style="grid-area: overview;">
      <Expandable class="w-full">
        <template #title>
          <div class="font-medium font-header">Overview</div>
        </template>
        <template #content>
          <div class="text-sm font-light leading-relaxed">
            {{ searchState.tmdb.overview }}
          </div>
        </template>
      </Expandable>
    </div>
    <div class="px-4" style="grid-area: settings">
      <slot name="settings" />
    </div>
    <div class="justify-self-end self-center px-4" style="grid-area: actions;">
      <a class="w-full text-primary-500 hover:text-primary-700" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, UnwrapRef } from 'vue';
import { capitalizeFirst } from '@/util/string';
import { SubtitleSearchState } from '@/search/state/types';
import { default as Spinner } from '@/components/Spinner.vue';
import { default as Expandable } from '@/components/Expandable.vue';

export default defineComponent({
  components: {
    Spinner,
    Expandable
  },
  props: {
    state: {
      type: String as PropType<string>,
      required: true
    },
    searchState: {
      type: Object as PropType<UnwrapRef<SubtitleSearchState>>,
      required: true
    }
  },
  emits: ['remove'],
  setup(props) {
    return {
      prettyState: computed(() => capitalizeFirst(props.state)),
      prettyMediaType: computed(() => capitalizeFirst(props.searchState?.tmdb?.media_type))
    };
  }
});
</script>
<style scoped>

.result-from-search--card {
  --image-height: 150px;
  grid-template-areas:
    'header  '
    '.       '
    'overview'
    '.       '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: var(--image-height) 16px auto 16px auto 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}

.result-from-search--card--hero--text {
  grid-template-areas:
    '.        .        .       .'
    'title    title    .       .'
    'subtitle subtitle .       .'
    '.        .        .       .'
    'detail   detail   detail2 .'
    '.        .        .       .';
  grid-template-rows: 8px auto auto 1fr auto 8px;
  grid-template-columns: 4px 1fr auto 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}
</style>
