<script setup="props" lang="ts">
import { computed, ref, watch } from 'vue';
import { SendIFrame, useWindowMessage, useMutationObserver } from '@/composables';
import { SrtEntry } from "@/appState";
import { isHTMLElement, isHTMLVideoElement } from '../../types';
import { addVttToHostVideo, addVttToIFrameVideo, removeVttFromHostVideo, removeVttFromIFrameVideo } from '../../vttInject';

declare const props: {
  subtitle: SrtEntry[];
};

interface Video {
  src: string;
  frameSrc: string;
  origin: string;
  hasSubtitle: boolean;
  in: 'I_FRAME' | 'HOST';
}

type VideoSrc = string;

const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
  [...document.querySelectorAll('video')]
    .map((el) => ({
      origin: window.origin,
      frameSrc: window.location.href,
      src: el.src,
      in: 'HOST',
      hasSubtitle: el.classList.contains('plussub')
    }))
    .reduce((acc, cur) => ({ ...acc, [cur.src]: cur }), {});

export const srcToVideo = ref<Record<VideoSrc, Video>>(findVideosInCurrentTab());
// don't make source(of iframe) reactive as it may cause cors problem
export const srcToSource: Record<VideoSrc, MessageEvent['source']> = {};

useWindowMessage({
  [SendIFrame]: ({ origin, source, data: { src, frameSrc, hasSubtitle } }) => {
    if (!srcToVideo.value[src]) {
      srcToSource[src] = source;
      srcToVideo.value[src] = { origin, hasSubtitle, src, frameSrc, in: 'I_FRAME' };
    }
  }
});

// sometimes the element in video tag is a advertisement, delete in video list if advertisement if removed
useMutationObserver((mutationsList) =>
  mutationsList
    .reduce<string[]>((acc, mutation) => {
      const nodes = Array.from(mutation.removedNodes);
      const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
      if (directMatch) {
        return [...acc, directMatch.src];
      }

      const parentMatches = nodes.reduce<string[]>(
        (acc, parent) => (isHTMLElement(parent) ? [...acc, ...Array.from<HTMLVideoElement>(parent.querySelectorAll('video')).map(({ src }) => src)] : acc),
        []
      );

      return [...acc, ...parentMatches];
    }, [])
    .forEach((src) => delete srcToVideo.value[src])
);

export const videoList = computed(() => Object.values(srcToVideo.value));

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

export const enterVideo = (video: Video): void => {
  const el = video.in === 'HOST' ? document.querySelector(`video[src="${video.src}"]`) : document.querySelector(`iframe[src="${video.frameSrc}"]`);
  if (el && isElementNotInViewport(el)) {
    el.scrollIntoView({ block: 'center' });
  }
  const plussubShadow = document.getElementById('plussubShadow');
  if (!plussubShadow) {
    return;
  }
  plussubShadow.style.top = `${(window.scrollY + 30).toString()}px`;
};

interface AddVttToPayload {
  video: Video;
  source?: MessageEvent['source'];
  subtitle: SrtEntry[];
}

export const addVttTo = ({ video, source, subtitle }: AddVttToPayload): void => {
  if (video.in === 'HOST') {
    addVttToHostVideo({ video, subtitle });
  } else {
    addVttToIFrameVideo({ video, source, subtitle });
  }
  video.hasSubtitle = true;
};

interface RemoveVttFromPayload {
  video: Video;
  source?: MessageEvent['source'];
}

export const removeVttFrom = ({ video, source }: RemoveVttFromPayload): void => {
  if (video.in === 'HOST') {
    removeVttFromHostVideo({ video });
  } else {
    removeVttFromIFrameVideo({ video, source });
  }
  video.hasSubtitle = false;
};

const videosWithSubtitle = computed(() => Object.values(srcToVideo.value).filter((e) => e.hasSubtitle));
watch(
  () => props.subtitle,
  (subtitle) =>
    videosWithSubtitle.value.forEach((video) => {
      removeVttFrom({ video, source: srcToSource[video.src] });
      addVttTo({ video, source: srcToSource[video.src], subtitle });
    })
);
export const pageHasSubtitle = computed(() => videosWithSubtitle.value.length > 0);
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
      <div v-if="videoList.length">
        <div v-for="(video, index) in videoList" :key="index" style="display: grid; grid-template-columns: 1fr auto" @mouseenter="enterVideo(video)">
          <div style="grid-column: 1 / 2; align-self: center">Video {{ index + 1 }}</div>
          <a v-if="video.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeVttFrom({ video, source: srcToSource[video.src] })">Remove Sub</a>
          <a
            v-else
            class="knopf flat small"
            :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }"
            style="grid-column: 2 / 3"
            @click="addVttTo({ video, source: srcToSource[video.src], subtitle })"
          >
            Add Subtitle</a
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
