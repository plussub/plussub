<template>
  <div class="videos--card">
    <div style="grid-area: header; height: 1px; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color); font-weight: 500">
      <div>
        <div>Page Videos</div>
        <div v-if="subtitle.length === 0" style="font-size: 0.4em; color: var(--default-text-color); font-weight: 400">You must first add a subtitle before you can add them to the video</div>
      </div>
    </div>
    <div style="grid-area: content">
      <div v-if="videos.length || videosInIframe.length">
        <div v-for="(video, index) in videos" :key="index" style="display: grid; grid-template-columns: 1fr auto" @mouseenter="enterVideoInTop(index)">
          <div style="grid-column: 1 / 2; align-self: center">Video {{ index + 1 }}</div>
          <a v-if="video.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeSubFrom(video.el)">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }" style="grid-column: 2 / 3" @click="addSubTo(video.el)">Add Subtitle</a>
        </div>
        <div v-for="(videoInIframe, index) in videosInIframe" :key="index" style="display: grid; grid-template-columns: 1fr auto" @mouseenter="enterVideoInIframe(index)">
          <div style="grid-column: 1 / 2; align-self: center">Video {{ videos.length + index + 1 }}</div>
          <a v-if="videoInIframe.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeVttFromIframe(videoInIframe)">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }" style="grid-column: 2 / 3" @click="addVttToIframe(videoInIframe, subtitle)"
            >Add Subtitle</a
          >
        </div>
      </div>
      <div v-else>No videos found in current tab.</div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { addVttTo, removeVttFrom, addVttToIframe, removeVttFromIframe } from '@/home/vttInject';

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

export default {
  props: {
    subtitle: Array,
    videosInIframe: Array
  },
  setup(props) {
    const findVideosInCurrentTab = () =>
      [...document.querySelectorAll('video')].map((el) => ({
        el,
        hasSubtitle: el.classList.contains('plussub')
      }));
    const videos = ref(findVideosInCurrentTab());
    const pageHasSubtitle = computed(() => document.querySelector('video.plussub') || props.videosInIframe.findIndex((videoInIframe) => videoInIframe.hasSubtitle) !== -1);

    const appShadowDiv = document.getElementById('plussubShadow');
    const enterVideoInTop = (index) => {
      const el = videos.value[index].el;
      if (isElementNotInViewport(el)) {
        el.scrollIntoView({ block: 'center' });
        appShadowDiv.style.top = `${(window.scrollY + 30).toString()}px`;
      }
    };
    const enterVideoInIframe = (index) => {
      const iframe = document.querySelector(`iframe[src="${props.videosInIframe[index].src}"]`);
      if (iframe && isElementNotInViewport(iframe)) {
        iframe.scrollIntoView({ block: 'center' });
        appShadowDiv.style.top = `${(window.scrollY + 30).toString()}px`;
      }
    };

    watch(
      () => props.subtitle,
      (subtitle) => {
        const elements = [...document.querySelectorAll('video.plussub')];
        elements.forEach((el) => removeVttFrom({ el }));
        if (subtitle.length) {
          elements.forEach((el) => addVttTo({ el, subtitle }));
        }
        videos.value = findVideosInCurrentTab();
        props.videosInIframe.forEach((videoInIframe) => {
          if (videoInIframe.hasSubtitle) {
            removeVttFromIframe(videoInIframe);
            if (subtitle.length) {
              addVttToIframe(videoInIframe, subtitle);
            }
          }
        });
      }
    );

    return {
      videos,
      pageHasSubtitle,
      enterVideoInTop,
      enterVideoInIframe,
      async addSubTo(el) {
        addVttTo({
          el,
          subtitle: props.subtitle
        });
        videos.value = findVideosInCurrentTab();
      },
      removeSubFrom: (el) => {
        removeVttFrom({ el });
        videos.value = findVideosInCurrentTab();
      },
      addVttToIframe,
      removeVttFromIframe
    };
  }
};
</script>

<style scoped>
/* plussub header */
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
