import {Ref} from "@vue/reactivity";

export type AppState = Ref<{
  state: 'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'ERROR' | 'DONE';
  src: 'NONE' | 'FILE' | 'SEARCH';
}>;
