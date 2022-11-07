<template>
  <PageLayout :content-transition-name='contentTransitionName'>
    <template #toolbar>
      <Toolbar>
        <a class='self-center pr-4' @click='toSettings()'>
          <FontAwesomeIcon icon='cog' class='h-icon hover:text-on-primary-hover-500'></FontAwesomeIcon>
        </a>
      </Toolbar>

    </template>
    <template #content>
      <div
        class='flex flex-wrap h-full home-content--container'
        :class="{ 'bg-surface-100': current === 'search-card' || current === 'file-card' }">
        <ResultFromSearch
          v-if="current === 'search-card'"
          :loading="store.loading"
          :error="store.error"
          :title="store.tmbdResult?.title"
          :open-subtitles-rating="store.openSubtitleResult?.rating"
          :open-subtitles-link="store.openSubtitleResult?.websiteLink"
          :tmdb-votes="store.tmbdResult?.vote_average.toString()"
          :tmdb-link="store.tmdbLink"
          :poster-path="store.tmbdResult?.poster_path"
          class='m-2'
          @remove='store.removeResult'>

          <template #hero-sub-header>
            {{
              `${capitalize(store.tmbdResult?.media_type)} ${store.releaseYear ? `/ ${store.releaseYear}` : ''}`
            }}
          </template>

          <template #settings>
            <Settings>
              <template #time-settings-tab-header="{select, selected }">
                <TimeSettingsTabHeader :selected='selected' @click="select">
                  <template #label>
                    <span>{{ store.currentTimeAs('hh:mm:ss') }}</span>
                  </template>
                </TimeSettingsTabHeader>
              </template>
              <template #time-settings-tab>
                <TimeSettingsTab/>
              </template>

              <template #appearance-settings-tab-header="{select, selected }">
                <AppearanceSettingsTabHeader :selected='selected' @click="select"/>
              </template>
              <template #appearance-settings-tab>
                <AppearanceSettingsTab/>
              </template>

              <template #transcript-tab-header="{select, selected }">
                <TranscriptTabHeader :selected='selected' @click="select" />
              </template>
              <template #transcript-tab>
                <TranscriptTab/>
              </template>

              <template #info-tab-header="{select, selected }">
                <SearchResultInfoTabHeader :selected='selected' @click="select" />
              </template>
              <template #info-tab>
                <SearchResultInfoTab
                  :format="store.openSubtitleResult?.format"
                  :language="store.openSubtitleResult?.languageName"
                />
              </template>
            </Settings>
          </template>

          <template #actions>
            <SuffixIconButton
              label='Highlight video'
              icon='crosshairs'
              @mouseenter='store.highlightCurrentVideo'
              @mouseleave='store.removeHighlightFromVideo'
            />
          </template>
        </ResultFromSearch>

        <ResultFromFile v-else-if="current === 'file-card'" class='m-2' @remove='store.removeResult'>

          <template #settings>
            <Settings>
              <template #time-settings-tab-header="{select, selected }">
                <TimeSettingsTabHeader :selected='selected' @click="select">
                  <template #label>
                    <span>{{ store.currentTimeAs('hh:mm:ss') }}</span>
                  </template>
                </TimeSettingsTabHeader>
              </template>
              <template #time-settings-tab>
                <TimeSettingsTab/>
              </template>

              <template #appearance-settings-tab-header="{select, selected }">
                <AppearanceSettingsTabHeader :selected='selected' @click="select"/>
              </template>
              <template #appearance-settings-tab>
                <AppearanceSettingsTab/>
              </template>

              <template #transcript-tab-header="{select, selected }">
                <TranscriptTabHeader :selected='selected' @click="select" />
              </template>
              <template #transcript-tab>
                <TranscriptTab/>
              </template>

              <template #info-tab-header="{select, selected }">
                <FileInfoTabHeader :selected='selected' @click="select" />
              </template>
              <template #info-tab>
                <FileInfoTab :filename="store.filenameResult"/>
              </template>
            </Settings>
          </template>

          <template #actions>
            <SuffixIconButton
              label='Highlight video'
              icon='crosshairs'
              @mouseenter='store.highlightCurrentVideo'
              @mouseleave='store.removeHighlightFromVideo'
            />
          </template>
        </ResultFromFile>

        <PageVideos
          v-else-if="current === 'page-videos'"
          class='w-full'
          :videos='store.videoList'
          @select='selectVideo'
          @video-enter='store.highlightVideo'
          @video-leave='store.removeHighlightFromVideo'
          @unmount='store.removeHighlightFromVideo'
        />
        <Mention />
      </div>
    </template>
  </PageLayout>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import ResultFromSearch from '@/search/components/ResultFromSearch.vue';
import ResultFromFile from '@/file/components/ResultFromFile.vue';
import FileInfoTabHeader from '@/file/tab/FileInfoTabHeader.vue';
import FileInfoTab from '@/file/tab/FileInfoTab.vue';
import PageVideos from '@/video/components/PageVideos.vue';
import Settings from '@/home/components/Settings.vue';
import SearchResultInfoTabHeader from '@/search/tab/SearchResultInfoTabHeader.vue';
import SearchResultInfoTab from '@/search/tab/SearchResultInfoTab.vue';
import Mention from '@/home/components/Mention.vue';
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

export default defineComponent({
  components: {
    TranscriptTabHeader,
    TranscriptTab,
    AppearanceSettingsTabHeader,
    AppearanceSettingsTab,
    TimeSettingsTab,
    TimeSettingsTabHeader,
    FontAwesomeIcon,
    Toolbar,
    PageLayout,
    ResultFromSearch,
    ResultFromFile,
    PageVideos,
    Settings,
    SearchResultInfoTabHeader,
    SearchResultInfoTab,
    FileInfoTabHeader,
    FileInfoTab,
    Mention,
    SuffixIconButton
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
      selectVideo: async (video: Video) => {
        await store.setCurrentVideo({ video });
        navigationStore.to('MOVIE-TV-SEARCH', { contentTransitionName: 'content-navigate-deeper' })
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
