<template>
  <PageLayout :content-transition-name='contentTransitionName'>
    <template #toolbar>
      <Toolbar>
        <a class='self-center pr-4' @click='toSettings()'>
          <FontAwesomeIcon icon='cog' class='h-icon hover:text-on-primary-hover-500'></FontAwesomeIcon>
        </a>
        <a class='self-center pr-4' @click='toAbout()'>
          <FontAwesomeIcon icon='question-circle' class='h-icon hover:text-on-primary-hover-500'></FontAwesomeIcon>
        </a>
      </Toolbar>
    </template>

    <template #content>
      <div class='flex flex-wrap h-full bg-surface-50 home-content--container'>
        <div v-if="current === 'file-card' || current === 'search-card'" class='w-full'>
          <HeroImageFromSearch
            v-if="current === 'search-card'"
            :loading='store.loading'
            :error='store.error'
            :title='store.tmbdResult?.title'
            :open-subtitles-rating='store.openSubtitleResult?.rating'
            :open-subtitles-link='store.openSubtitleResult?.websiteLink'
            :tmdb-votes='store.tmbdResult?.vote_average.toString()'
            :tmdb-link='store.tmdbLink'
            :poster-path='store.tmbdResult?.poster_path'
          >
            <template #hero-sub-header>
              {{
                `${capitalize(store.tmbdResult?.media_type)} ${store.releaseYear ? `/ ${store.releaseYear}` : ''}`
              }}
            </template>
          </HeroImageFromSearch>
          <Settings class='w-full'>
            <template #time-settings-tab-header='{select, selected }'>
              <TimeSettingsTabHeader
                :selected='selected'
                @click='select'
                @mouseenter='store.highlightCurrentVideo'
                @mouseleave='store.removeHighlightFromVideo'
              >
                <template #label>
                  <span>{{ store.currentTimeAs('hh:mm:ss') }}</span>
                </template>
              </TimeSettingsTabHeader>
            </template>
            <template #time-settings-tab>
              <TimeSettingsTab class='bg-surface-100' />
            </template>

            <template #appearance-settings-tab-header='{select, selected }'>
              <AppearanceSettingsTabHeader :selected='selected' @click='select' />
            </template>
            <template #appearance-settings-tab>
              <AppearanceSettingsTab />
            </template>

            <template #transcript-tab-header='{select, selected }'>
              <TranscriptTabHeader :selected='selected' @click='select' />
            </template>
            <template #transcript-tab>
              <TranscriptTab />
            </template>

            <template #info-tab-header='{select, selected }'>
              <FileInfoTabHeader v-if="current === 'file-card'" :selected='selected' @click='select' />
              <SearchResultInfoTabHeader v-else :selected='selected' @click='select' />
            </template>
            <template #info-tab>
              <FileInfoTab
                v-if="current === 'file-card'"
                :filename='store.filenameResult'
                :count-subtitle-lines='store.countSubtitleLines'
                :max-subtitle-duration='store.maxSubtitleDuration("hh:mm:ss")'
              />
              <SearchResultInfoTab
                v-else
                :format='store.openSubtitleResult?.format'
                :language='store.openSubtitleResult?.languageName'
                :count-subtitle-lines='store.countSubtitleLines'
                :max-subtitle-duration='store.maxSubtitleDuration("hh:mm:ss")'
              />
            </template>

          </Settings>


          <Divider class='w-full border-surface-200'></Divider>

          <div class='flex flex-wrap mx-9 my-6 gap-6 flex-col'>
            <div class='flex flex-row-reverse'>
              <SuffixIconButton
                label='Remove Subtitle'
                icon='eject'
                class='flex flex-row-reverse rounded-full px-2 py-2 border-solid border-2 border-primary-500 hover:border-primary-700 hover:bg-surface-200 hover:cursor-pointer'
                @click='store.removeResult'
              />
            </div>
          </div>
        </div>
        <PageVideos
          v-else-if="current === 'page-videos'"
          class='w-full'
          :videos='store.videoList'
          @select='selectVideo'
          @video-enter='store.highlightVideo'
          @video-leave='store.removeHighlightFromVideo'
          @unmount='store.removeHighlightFromVideo'
        />
      </div>
    </template>
  </PageLayout>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import HeroImageFromSearch from '@/search/components/HeroImageFromSearch.vue';
import FileInfoTabHeader from '@/file/tab/FileInfoTabHeader.vue';
import FileInfoTab from '@/file/tab/FileInfoTab.vue';
import PageVideos from '@/video/components/PageVideos.vue';
import Settings from '@/home/components/Settings.vue';
import SearchResultInfoTabHeader from '@/search/tab/SearchResultInfoTabHeader.vue';
import SearchResultInfoTab from '@/search/tab/SearchResultInfoTab.vue';
import Toolbar from '@/toolbar/Toolbar.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import { useStore as useAppStore } from '@/app/store';
import { useStore as useNavigationStore } from '@/navigation/store';
import SuffixIconButton from '@/components/SuffixIconButton.vue';
import { useStore } from './homeStore';
import { useStringFn } from '@/composables';
import TimeSettingsTabHeader from '@/subtitle/tab/TimeSettingsTabHeader.vue';
import TimeSettingsTab from '@/subtitle/tab/TimeSettingsTab.vue';
import AppearanceSettingsTabHeader from '@/appearance/tab/AppearanceSettingsTabHeader.vue';
import AppearanceSettingsTab from '@/appearance/tab/AppearanceSettingsTab.vue';
import TranscriptTabHeader from '@/transcript/tab/TranscriptTabHeader.vue';
import TranscriptTab from '@/transcript/tab/TranscriptTab.vue';
import { Video } from '@/video/store';
import Divider from '@/components/Divider.vue';

export default defineComponent({
  components: {
    HeroImageFromSearch,
    TranscriptTabHeader,
    TranscriptTab,
    AppearanceSettingsTabHeader,
    AppearanceSettingsTab,
    TimeSettingsTab,
    TimeSettingsTabHeader,
    FontAwesomeIcon,
    Toolbar,
    PageLayout,
    PageVideos,
    Settings,
    SearchResultInfoTabHeader,
    SearchResultInfoTab,
    FileInfoTabHeader,
    FileInfoTab,
    SuffixIconButton,
    Divider
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const store = useStore();

    const appStore = useAppStore();
    const navigationStore = useNavigationStore();
    const { capitalize } = useStringFn();

    return {
      store,
      capitalize,
      toSettings: () => navigationStore.to('SETTINGS', { contentTransitionName: 'content-navigate-deeper' }),
      toAbout: () => navigationStore.to('ABOUT', { contentTransitionName: 'content-navigate-deeper' }),
      selectVideo: async (video: Video) => {
        await store.setCurrentVideo({ video });
        navigationStore.to('MOVIE-TV-SEARCH', { contentTransitionName: 'content-navigate-deeper' });
      },
      current: computed(() => {
        if (appStore.state !== 'NONE' && appStore.src === 'SEARCH') {
          return 'search-card';
        }
        if (appStore.state !== 'NONE' && appStore.src === 'FILE') {
          return 'file-card';
        }
        if (appStore.state === 'NONE') {
          return 'page-videos';
        }
        return 'unknown';
      })
    };
  }
});
</script>

<style scoped>
.home-content--container {
  min-height: 300px;
  max-height: 720px;
}

.home-content--container-old {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    'current-sub'
    'videos'
    'contribution';
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  row-gap: 16px;
}
</style>
