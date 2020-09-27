export interface VideoInIframe {
  src: string;
  hasSubtitle: boolean;
}

export interface VideoInIframeState {
  videosInIframe: VideoInIframe[];
}

const state = (): { videosInIframe: VideoInIframe[] } => ({
  videosInIframe: []
});

const getters = {};

const mutations = {
  pushVideosInIframe(state: VideoInIframeState, videoInIframe: VideoInIframe): void {
    state.videosInIframe.push(videoInIframe);
  },
  setSubtitleStatus(state: VideoInIframeState, videoInIframe: VideoInIframe): void {
    const { src, hasSubtitle } = videoInIframe;
    const index = state.videosInIframe.findIndex((videoInIframe) => videoInIframe.src === src);
    if (index !== -1) {
      state.videosInIframe[index].hasSubtitle = hasSubtitle;
    }
  }
};

export const videoInIframe = {
  namespaced: true,
  state,
  getters,
  //   actions,
  mutations
};
