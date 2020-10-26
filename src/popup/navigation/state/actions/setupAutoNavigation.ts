/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed, watch } from 'vue';
import { videoCount, videoList } from '@/video/state';
import { navigationState, setCurrentSelectedSrc, toHome, toSearch } from '@/navigation/state';
import { appState } from '@/app/state';

const appStateState = computed(() => appState.value.state);

export const setupAutoNavigation = (): void => {
  watch(
    [videoCount, appStateState],
    ([videoCount], [prevVideoCount]) => {
      // navigate if only 1 video exists
      if (videoCount === 1 && navigationState.value.name === 'HOME' && appState.value.state === 'NONE') {
        setCurrentSelectedSrc(videoList.value[0].src);
        toSearch();
        return;
      }

      // navigate to selection if additional videos appear
      if (videoCount > 1 && prevVideoCount === 1 && navigationState.value.name === 'SEARCH' && appState.value.state === 'NONE') {
        setCurrentSelectedSrc(null);
        toHome();
        return;
      }

      if (videoCount === 0 && navigationState.value.name !== 'HOME') {
        toHome();
        return;
      }
    },
    { immediate: true }
  );
};
