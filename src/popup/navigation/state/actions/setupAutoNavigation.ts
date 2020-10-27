/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed, watch } from 'vue';
import { videoCount, videoList } from '@/video/state';
import { navigationState, setCurrentSelectedSrc, toHome, toSearch } from '@/navigation/state';
import { appState } from '@/app/state';

const appStateState = computed(() => appState.value.state);

export const setupAutoNavigation = (): void => {
  watch(
    [videoCount, appStateState, videoList],
    ([videoCount, _, videoList], [prevVideoCount,prev_, prevVideoList]) => {

      // navigate if only 1 video exists
      if (videoCount === 1 && navigationState.value.name === 'HOME' && appState.value.state === 'NONE') {
        setCurrentSelectedSrc(videoList[0].src);
        toSearch();
        return;
      }

      // hack: set current src if video src change like vimeo next
      if(videoCount === 1 && videoList[0].src !== (prevVideoList ?? [{src: null}])[0]?.src){
        setCurrentSelectedSrc(videoList[0].src);
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
