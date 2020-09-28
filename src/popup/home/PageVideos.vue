<template>
  <div class="videos--card">
    <div
        style="grid-area: header; height: 1px; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500;">
      <div>
        <div>Page Videos</div>
        <div style="font-size: 0.4em; color: var(--default-text-color); font-weight: 400;" v-if="subtitle.length === 0">
          You must first add a subtitle before you can add them to the video
        </div>
      </div>
    </div>
    <div style="grid-area: content;">
      <div v-if="videos.length || videosInIframe.length">
        <div v-for="(video, index) in videos" :key="index" style="display: grid; grid-template-columns: 1fr auto;">
          <div style="grid-column: 1 / 2; align-self: center;">Video {{ index + 1 }}</div>
          <a v-if="video.hasSubtitle" class="knopf flat small" @click="removeSubFrom(video.el)" style="grid-column: 2 / 3;">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0}" @click="addSubTo(video.el)" style="grid-column: 2 / 3;">Add Subtitle</a>
        </div>
        <div v-for="(videoInIframe, index) in videosInIframe" :key="index" style="display: grid; grid-template-columns: 1fr auto;">
          <div style="grid-column: 1 / 2; align-self: center;">Video {{ videos.length + index + 1 }}</div>
          <a v-if="videoInIframe.hasSubtitle" class="knopf flat small" @click="removeVttFromIframe({src:videoInIframe.src})" style="grid-column: 2 / 3;">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0}" @click="addVttToIframe({src:videoInIframe.src, subtitle})" style="grid-column: 2 / 3;">Add Subtitle</a>
        </div>
      </div>
      <div v-else>
        No videos found in current tab.
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch} from "vue";
import {addVttTo, removeVttFrom, addVttToIframe, removeVttFromIframe} from '@/home/vttInject';

export default {
  props: {
    subtitle: Array,
    videosInIframe: Array
  },
  setup(props) {
    const findVideosInCurrentTab = () => [...document.querySelectorAll('video')].map((el) => ({
      el,
      hasSubtitle: el.classList.contains('plussub')
    }));
    const videos = ref(findVideosInCurrentTab());

    watch(() => props.subtitle, (subtitle) => {
      const elements = [...document.querySelectorAll('video.plussub')];
      elements.forEach(el => removeVttFrom({el}));
      elements.forEach(el => addVttTo({el, subtitle}));
      props.videosInIframe
        .forEach(video => {
          if (video.hasSubtitle) {
            const {src} = video
            removeVttFromIframe({src})
            addVttToIframe({src, subtitle})
          }
        })
    });

    return {
      videos,
      async addSubTo(el) {
        addVttTo({
          el,
          subtitle: props.subtitle
        });
        videos.value = findVideosInCurrentTab();
      },
      removeSubFrom:(el) => {
        removeVttFrom({el});
        videos.value = findVideosInCurrentTab();
      },
      addVttToIframe,
      removeVttFromIframe
    }
  }
}
</script>

<style scoped>/* plussub header */
.videos--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-border-radius);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. header .'
    '. . .'
    '. content .'
    '. . .';
  grid-template-rows: 50px 16px auto 8px;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
  height: fit-content;
}
</style>
