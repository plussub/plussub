import { AppStore } from '@/app/store';
import { SearchStore } from '@/search/store';
import { SubtitleStore } from '@/subtitle/store';
import { VideoStore } from '@/video/store';
import { NavigationStore } from '@/navigation/store';
import { FileStore } from '@/file/store';
import { TrackStore } from '@/track/store';
import { ApiStore } from '@/api/store';
import { AppearanceStore } from '@/appearance/store';
import { ContentScriptStore } from '@/contentScript/store';

export type StoreKey = 'appStore' | 'searchStore' | 'subtitleStore' | 'videoStore' | 'navigationStore' | 'fileStore' | 'trackStore' | 'apiStore' | 'appearanceStore' | 'contentScriptStore';
export type Store<T extends StoreKey> = T extends 'appStore'
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
  : T extends 'appearanceStore'
  ? AppearanceStore
  : T extends 'contentScriptStore'
  ? ContentScriptStore
  : unknown;
