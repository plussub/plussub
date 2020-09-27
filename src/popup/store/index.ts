import { createStore, Store } from 'vuex';
import { videoInIframe, VideoInIframeState } from './modules/videoInIframe';

export interface State {
  videoInIframe: VideoInIframeState;
}

export const store: Store<State> = createStore({
  modules: { videoInIframe }
});

export function useStore(): Store<State> {
  return store;
}
