<script setup="props" lang="ts">
import { computed, ref } from 'vue';
import {SendIFrame, useWindowMessage} from '@/composables';
import { addVttTo, removeVttFrom, addVttToIframe, removeVttFromIframe } from '@/home/vttInject';

declare const props: {
  subtitle: [];
}

interface VideoInIFrame {
  src: string;
  origin: string;
  hasSubtitle: boolean;
}
// todo: handle lifecylce
// use src as key instead array
export const videosInIframe = ref<VideoInIFrame[]>([]);
// don't make source(of iframe) reactive as it may cause cors problem
export const sourceObj: Record<string, MessageEvent['source']> = {};

useWindowMessage({
  [SendIFrame]: ({origin, source, data: {src, hasSubtitle}}) => {
    if (!videosInIframe.value.find((video) => video.src === src)) {
      sourceObj[src] = source;
      videosInIframe.value.push({origin, hasSubtitle, src});
    }
  }
});

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

const isElement = (obj: unknown): obj is HTMLElement => obj instanceof HTMLElement;

const findVideosInCurrentTab = () =>
    [...document.querySelectorAll('video')].map((el) => ({
      el,
      hasSubtitle: el.classList.contains('plussub')
    }));

// todo: handle lifecylce
// sometimes the element in video tag is a advertisement, delete in video list if advertisement if removed
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    const nodes = Array.from(mutation.removedNodes);
    const directMatch = nodes.find((node) => (node as Element).tagName === 'video');
    let childVideo;
    const parentMatch = nodes.some((parent) => {
      if (!isElement(parent)) return false;
      childVideo = parent.querySelector('video');
      if (childVideo) return true;
    });
    if (directMatch) {
      const index = videos.value.findIndex((video) => directMatch.isEqualNode(video.el));
      if (index > -1) {
        videos.value.splice(index, 1);
      }
    } else if (parentMatch) {
      const index = videos.value.findIndex((video) => childVideo.isEqualNode(video.el));
      if (index > -1) {
        videos.value.splice(index, 1);
      }
    }
  });
});
observer.observe(document.body, { subtree: true, childList: true });

// todo:
// watch(
//     () => props.subtitle,
//     (subtitle) => {
//       const elements = [...document.querySelectorAll('video.plussub')];
//       elements.forEach((el) => removeVttFrom({ el }));
//       if (subtitle.length) {
//         elements.forEach((el) => addVttTo({ el, subtitle }));
//       }
//       videos.value = findVideosInCurrentTab();
//       props.videosInIframe.forEach((videoInIframe) => {
//         if (videoInIframe.hasSubtitle) {
//           removeVttFromIframe(videoInIframe);
//           if (subtitle.length) {
//             addVttToIframe(videoInIframe, subtitle);
//           }
//         }
//       });
//     }
// );

export {addVttToIframe, removeVttFromIframe};
export const videos =  ref(findVideosInCurrentTab());
// todo:
// export const pageHasSubtitle = computed(() => document.querySelector('video.plussub') || props.videosInIframe.findIndex((videoInIframe) => videoInIframe.hasSubtitle) !== -1);
export const pageHasSubtitle = computed(() => false);
export const addSubTo = async(el) => {
  addVttTo({
    el,
    subtitle: props.subtitle
  });
  videos.value = findVideosInCurrentTab();
};
export const removeSubFrom = (el) => {
  removeVttFrom({ el });
  videos.value = findVideosInCurrentTab();
};

export const enterVideoInTop = (index) => {
  const el = videos.value[index].el;
  if (isElementNotInViewport(el)) {
    el.scrollIntoView({ block: 'center' });
    // document.getElementById('plussubShadow').style.top = `${(window.scrollY + 30).toString()}px`;
  }
};

export const enterVideoInIframe = (index) => {
  // cannot use sourceObj beacuse of cors
  // const iframe = document.querySelector(`iframe[src="${props.videosInIframe[index].src}"]`);
  // if (iframe && isElementNotInViewport(iframe)) {
  //   iframe.scrollIntoView({ block: 'center' });
    // document.getElementById('plussubShadow').style.top = `${(window.scrollY + 30).toString()}px`;
  // }
};
</script>

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
          <a v-if="videoInIframe.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeVttFromIframe(videoInIframe, sourceObj)">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }" style="grid-column: 2 / 3" @click="addVttToIframe(videoInIframe, subtitle, sourceObj)"
          >Add Subtitle</a
          >
        </div>
      </div>
      <div v-else>No videos found in current tab.</div>
    </div>
  </div>
</template>

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
