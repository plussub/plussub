<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar>
        <a class="self-center pr-4" @click="toSettings()">
          <FontAwesomeIcon icon="cog" class="h-icon hover:text-on-primary-hover-500"></FontAwesomeIcon>
        </a>
      </Toolbar>

    </template>
    <template #content>
      <div class="flex flex-wrap h-full home-content--container" :class="{ 'bg-surface-100': current === 'search-card' || current === 'file-card' }">
        <ResultFromSearch v-if="current === 'search-card'" class="m-2">
          <template #settings>
            <Settings>
              <template #info>
                <SearchResultInfo/>
              </template>
            </Settings>
          </template>
        </ResultFromSearch>

        <ResultFromFile v-else-if="current === 'file-card'" class="m-2">
          <template #settings>
            <Settings>
              <template #info>
                <FileInfo />
              </template>
            </Settings>
          </template>
        </ResultFromFile>

        <PageVideos v-else-if="current === 'page-videos'" class="w-full" />
        <Mention/>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import PageLayout from '@/components/PageLayout.vue';
import ResultFromSearch from '@/search/components/ResultFromSearch.vue';
import ResultFromFile from '@/file/components/ResultFromFile.vue';
import FileInfo from '@/file/components/FileInfo.vue';
import PageVideos from '@/video/components/PageVideos.vue';
import Settings from '@/subtitle/components/Settings.vue';
import { useInjectStore } from '@/useInjectStore';
import SearchResultInfo from "@/search/components/SearchResultInfo.vue";
import Mention from "@/home/components/Mention.vue";
import Toolbar from '@/Toolbar/Toolbar.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon,
    Toolbar,
    SearchResultInfo,
    PageLayout,
    ResultFromSearch,
    ResultFromFile,
    PageVideos,
    Settings,
    FileInfo,
    Mention
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const appStore = useInjectStore('appStore');
    const navigationStore = useInjectStore('navigationStore');

    return {
      appState: appStore.state,
      toSettings: navigationStore.actions.toSettings,
      current: computed(() => {
        if (appStore.state.value.state !== 'NONE' && appStore.state.value.src === 'SEARCH') {
          return 'search-card';
        }
        if (appStore.state.value.state !== 'NONE' && appStore.state.value.src === 'FILE') {
          return 'file-card';
        }
        if (appStore.state.value.state === 'NONE') {
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
