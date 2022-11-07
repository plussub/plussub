<template>
  <PageLayout :content-transition-name='contentTransitionName'>
    <template #toolbar>
      <Toolbar :has-back='store.existsMultipleVideos' :back-fn='backFn'>
        <a v-if='store.onlySingleVideo' class='self-center pr-4' @click='toSettings()'>
          <FontAwesomeIcon icon='cog' class='h-icon hover:text-on-primary-hover-500'></FontAwesomeIcon>
        </a>
      </Toolbar>
    </template>
    <template #content>
      <div class='w-full h-full grid relative justify-center search-content--container'>
        <div style='grid-area: search-bar' class='pt-3 pb-2 bg-primary-50'>
          <InputField
            v-model='internalQuery'
            class='px-2'
            placeholder-icon='search'
            placeholder='Search movie or series'
          />
          <div v-show='store.existsVideoName' class='px-5 mt-2 leading-normal text-sm'>
            <div class='italic'>Search Suggestion</div>
            <a
              class='relative text-primary-700 hover:underline italic'
              @click='changeQueryToSuggested'>{{ store.videoName }}
            </a>
          </div>
        </div>
        <div style='grid-area: loading' class='flex items-end flex-wrap bg-primary-50 shadow-md'>
          <LoadingBar :loading="store.loading && internalQuery !== ''" class='w-full' />
        </div>
        <div v-if='store.entries.length' class='overflow-y-auto' style='grid-area: search-results'>
          <div v-for='(item, index) in store.entries' :key='index'>
            <Divider v-if='index === 0' style='grid-column: 1/3' class='border-surface-200' />
            <MovieTvSearchEntry :item='item' @select='select' />
            <Divider style='grid-column: 1/3' class='border-surface-200' />
          </div>
        </div>
        <div
          v-else-if="internalQuery === ''"
          style='grid-area: search-results; grid-column: 1/2; grid-row: 3/4'
          class='my-4'>
          <FilePick
            v-model:query='internalQuery'
            @dropzone-enter='store.highlightCurrentVideo'
            @dropzone-leave='store.removeHighlightFromVideo'
            @unmount='store.removeHighlightFromVideo'
            @load='loadFile'
          />
        </div>
        <div v-else-if='!store.loading' class='self-center text-center leading-loose' style='grid-area: search-results'>
          <div>Sorry, no movies or tv shows found</div>
          <div>(╯°□°)╯︵ ┻━┻</div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang='ts'>
import { defineComponent, onUnmounted, PropType, ref, watch } from 'vue';
import { VideoSearchResultEntry } from './searchQuery';

import FilePick from '@/file/components/FilePick.vue';
import PageLayout from '@/components/PageLayout.vue';
import Divider from '@/components/Divider.vue';
import MovieTvSearchEntry from '../../components/MovieTvSearchEntry.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import InputField from '@/components/InputField.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore } from './movieTvSearchStore';

export default defineComponent({
  components: {
    FontAwesomeIcon,
    Toolbar,
    InputField,
    LoadingBar,
    FilePick,
    PageLayout,
    Divider,
    MovieTvSearchEntry
  },
  props: {
    query: {
      type: String as PropType<string>,
      required: false,
      default: ''
    },
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const store = useStore();
    const navigationStore = useNavigationStore();
    store.initialize();

    const internalQuery = ref(props.query ?? '');

    watch(internalQuery, (query) => {
      store.$patch({ query });
      store.triggerQuery();
    }, { immediate: true });

    onUnmounted(() => store.unmount());

    return {
      store,
      internalQuery,
      loadFile: async (payload) => {
        await store.loadFile(payload);
        // workaround for contentscript communication
        setTimeout(() => navigationStore.to('HOME', { contentTransitionName: 'content-navigate-select-to-home' }), 100);
      },
      toSettings: () => navigationStore.to('SETTINGS', { contentTransitionName: 'content-navigate-deeper' }),
      changeQueryToSuggested: () => (internalQuery.value = store.videoName),
      select: (entry: VideoSearchResultEntry): void => {
        store.selectEntry(entry);
        if (store.selected.media_type === 'movie') {
          navigationStore.to('SUBTITLE-SEARCH-FOR-MOVIES', {
            tmdb_id: store.selected.tmdb_id,
            media_type: store.selected.media_type,
            searchQuery: store.query,
            contentTransitionName: 'content-navigate-deeper' as const
          });
        } else {
          navigationStore.to('SUBTITLE-SEARCH-FOR-SERIES', {
            tmdb_id: store.selected.tmdb_id,
            media_type: store.selected.media_type,
            searchQuery: store.query,
            contentTransitionName: 'content-navigate-deeper' as const
          });
        }

      },
      backFn: async (): Promise<void> => {
        await store.removeCurrentSelectedVideo();
        navigationStore.to('HOME', { contentTransitionName: 'content-navigate-shallow' });
      }
    };
  }
});
</script>

<style scoped>
.search-content--container {
  min-height: 300px;
  max-height: 500px;
  grid-template-areas:
    'search-bar'
    'loading'
    'search-results';
  grid-template-rows: auto 8px 1fr;
  grid-template-columns: 1fr;
}
</style>
