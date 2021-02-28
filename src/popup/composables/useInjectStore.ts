import { inject } from 'vue';
import { AppStore } from '@/app/store';
import { SearchStore } from '@/search/store';
import { SubtitleStore } from '@/subtitle/store';
import { VideoStore } from '@/video/store';
import { NavigationStore } from '@/navigation/store';
import { FileStore } from '@/file/store';
import { TrackStore } from '@/track/store';
import { ApiStore } from '@/api/store';

type StoreKey = 'appStore' | 'searchStore' | 'subtitleStore' | 'videoStore' | 'navigationStore' | 'fileStore' | 'trackStore' | 'apiStore';
type ReturnType<T extends StoreKey> = T extends 'appStore'
  ? AppStore
  : T extends 'searchStore'
  ? SearchStore
  : T extends 'subtitleStore'
  ? SubtitleStore
  : T extends 'videoStore'
  ? VideoStore
  : T extends 'navigationStore'
  ? NavigationStore
  : T extends 'fileStore'
  ? FileStore
  : T extends 'trackStore'
  ? TrackStore
  : T extends 'apiStore'
  ? ApiStore
  : unknown;

export const useInjectStore = <T extends StoreKey>(storeKey: T): ReturnType<T> => {
  const store = inject<ReturnType<T>>(storeKey);
  if (!store) {
    throw new Error(`inject failed: ${storeKey}`);
  }
  return store;
};
