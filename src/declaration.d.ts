declare module '*.png';
declare module '*.svg';

declare module 'plussub-state' {
  import {AppState} from "@/app/state/types";
  import {FileState} from "@/file/state/types";
  import {SubtitleState} from "@/subtitle/state/types";
  import {SubtitleSearchState} from "@/search/state/types";
  global {
    interface Window {
      plusSub_app: AppState
      plusSub_file: FileState
      plusSub_subtitle: SubtitleState
      plusSub_subtitleSearch: SubtitleSearchState
    }
  }
}
