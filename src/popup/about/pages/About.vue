<template>
  <PageLayout :content-transition-name='contentTransitionName'>
    <template #toolbar>
      <Toolbar has-back :back-fn='backFn'></Toolbar>
    </template>
    <template #content>
      <div class='w-full bg-surface-100'>
        <div class='flex relative pl-4 py-4 bg-primary-50 shadow-md font-medium text-xl'>
          <div>About</div>
        </div>

        <div class='p-6 m-2 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
          <h1 class='mb-2 text-2xl font-bold tracking-tight'>Whats New</h1>
          <h2 class='mb-2 text-lg text-primary-700'>6.3.x</h2>
          <p class='pl-2 mb-3 font-normal leading-loose'>
            <span class='font-bold'>Subtitle customizing</span> <br>
            <span class='leading-normal'>Font outline for better contrast</span> <br>
            <span class='leading-normal'>Each customizing can be enabled or disabled </span>
          </p>
        </div>

        <div class='p-6 m-2 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
          <h1 class='mb-2 text-2xl font-bold tracking-tight'>This extension is powered by</h1>
          <div class='ml-2 leading-loose'>
            <a href='https://opensubtitles.org/' target='_blank'
               class='font-bold inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline pr-1'>
              <span>OpenSubtitles</span>
              <FontAwesomeIcon icon='external-link-alt' class='self-center h-icon-sm pb-1' />
            </a>
            <span class='pl-1'>for the subtitles</span>

          </div>
          <div class='ml-2 leading-loose'>
            <a href='https://www.themoviedb.org/' target='_blank'
               class='font-bold inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline pr-1'>
              <span>TMDb</span>
              <FontAwesomeIcon icon='external-link-alt' class='self-center h-icon-sm pb-1' />
            </a>
            <span class='pl-1'>for the movie infos</span>
          </div>
          <div class='ml-2 leading-loose'>
            <a href='https://fontawesome.com/' target='_blank'
               class='font-bold inline-flex gap-0.5 text-primary-500 hover:text-primary-700 hover:underline pr-1'>
              <span>Font Awesome</span>
              <FontAwesomeIcon icon='external-link-alt' class='self-center h-icon-sm pb-1' />
            </a>
            <span class='pl-1'>for the icons</span>
          </div>
        </div>
        <Mention class='mt-8' />
      </div>
    </template>
  </PageLayout>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import { useStore as useNavigationStore } from '@/navigation/store';
import { useStore as useVideoStore } from '@/video/store';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    Toolbar,
    PageLayout,
    FontAwesomeIcon
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const navigationStore = useNavigationStore();
    const videoStore = useVideoStore();

    return {
      backFn: () => (videoStore.count === 1 ?
        navigationStore.to('MOVIE-TV-SEARCH', { contentTransitionName: 'content-navigate-shallow' }) :
        navigationStore.to('HOME', { contentTransitionName: 'content-navigate-shallow' }))
    };
  }
});
</script>
