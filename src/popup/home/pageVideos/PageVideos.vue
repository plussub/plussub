<script setup="props" lang="ts">
import { computed, ref } from 'vue';
import { SendIFrame, useWindowMessage, useMutationObserver } from '@/composables';
import { SrtEntry } from '../../appState';

declare const props: {
  subtitle: [];
};

type VideoSrc = string;

interface VideoEntry {
  src: string;
  frameSrc: string;
  origin: string;
  hasSubtitle: boolean;
}

const findVideosInCurrentTab = (): Record<VideoSrc, VideoEntry> =>
  [...document.querySelectorAll('video')]
    .map((el) => ({
      origin: window.origin,
      frameSrc: window.location.href,
      src: el.src,
      hasSubtitle: el.classList.contains('plussub')
    }))
    .reduce((acc, cur) => ({ ...acc, [cur.src]: cur }), {});

export const srcToVideo = ref<Record<VideoSrc, VideoEntry>>(findVideosInCurrentTab());
// don't make source(of iframe) reactive as it may cause cors problem
export const srcToSource: Record<VideoSrc, MessageEvent['source']> = {};

useWindowMessage({
  [SendIFrame]: ({ origin, source, data: { src, frameSrc, hasSubtitle } }) => {
    if (!srcToVideo.value[src]) {
      srcToSource[src] = source;
      srcToVideo.value[src] = { origin, hasSubtitle, src, frameSrc };
    }
  }
});

const isHTMLElement = (node: Node | undefined | null): node is HTMLElement => node !== undefined && node !== null && node.nodeType === Node.ELEMENT_NODE;
const isHTMLVideoElement = (element: Node | undefined | null): element is HTMLVideoElement => isHTMLElement(element) && (element as HTMLElement).tagName === 'video';

// sometimes the element in video tag is a advertisement, delete in video list if advertisement if removed
useMutationObserver((mutationsList) =>
  mutationsList
    .reduce<string[]>((acc, mutation) => {
      const nodes = Array.from(mutation.removedNodes);
      const directMatch = nodes.find((node): node is HTMLVideoElement => isHTMLVideoElement(node));
      if (directMatch) {
        return [...acc, directMatch.src];
      }

      const parentMatches = nodes.reduce<string[]>((acc, parent) => {
        if (!isHTMLElement(parent)) {
          return acc;
        }
        return [...acc, ...(Array.from<HTMLVideoElement>(parent.querySelectorAll('video')).map(({ src }) => src))];
      }, []);

      return [...acc, ...parentMatches];
    }, [])
    .forEach((src) => delete srcToVideo.value[src])
);

const srcToVideoWithSubtitle = computed(() =>
  Object.entries(srcToVideo.value).reduce(
    (acc, [src, entry]) => ({
      ...acc,
      ...(entry.hasSubtitle ? { [src]: entry } : {})
    }),
    {}
  )
);
export const videoList = computed(() => Object.values(srcToVideo.value));
export const pageHasSubtitle = computed(() => Object.keys(srcToVideoWithSubtitle.value).length > 0);

// // todo:
// watch(
//   () => props.subtitle,
//   (subtitle) => {
//     const entries = Object.values(srcToVideoWithSubtitle.value);
//     // entries forEach remove Vtt
//     // entries forEach add
//
//     const elements = [...document.querySelectorAll('video.plussub')];
//     elements.forEach((el) => removeVttFrom({ el }));
//     if (subtitle.length) {
//       elements.forEach((el) => addVttTo({ el, subtitle }));
//     }
//     videos.value = findVideosInCurrentTab();
//     props.videosInIframe.forEach((videoInIframe) => {
//       if (videoInIframe.hasSubtitle) {
//         removeVttFromIframe(videoInIframe);
//         if (subtitle.length) {
//           addVttToIframe(videoInIframe, subtitle);
//         }
//       }
//     });
//   }
// );

const isElementNotInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
};

export const enterVideo = (videoEntry: VideoEntry): void => {
  if (videoEntry.origin === window.origin) {
    const el = document.querySelector(`video[src="${videoEntry.src}"]`);
    if (el && isElementNotInViewport(el)) {
      el.scrollIntoView({ block: 'center' });
    }
  } else {
    // cannot use sourceObj beacuse of cors
    const iframe = document.querySelector(`iframe[src="${videoEntry.frameSrc}"]`);
    if (iframe && isElementNotInViewport(iframe)) {
      iframe.scrollIntoView({ block: 'center' });
    }
  }
  const el = document.getElementById('plussubShadow');
  if (!el) {
    return;
  }
  el.style.top = `${(window.scrollY + 30).toString()}px`;
};

interface AddVttToPayload {
  videoEntry: VideoEntry;
  sourceObj?: MessageEvent['source'];
  subtitle: SrtEntry[];
}

export const addVttTo = ({ videoEntry, sourceObj, subtitle }: AddVttToPayload): void => {
  if (videoEntry.origin === window.origin) {
    const el = document.querySelector(`video[src="${videoEntry.src}"]`);
    if (!isHTMLVideoElement(el)) {
      return;
    }
    const cues = subtitle.map((srt) => new VTTCue(srt.from / 1000, srt.to / 1000, `<c.plussub>${srt.text}</c.plussub>`));
    Array.from(el.textTracks).forEach((track) => (track.mode = 'hidden'));
    const track = el.addTextTrack('subtitles', `Plussub`, 'en');
    cues.forEach((cue) => track.addCue(cue));
    track.mode = 'showing';
    el.classList.add('plussub');
  } else {
    (sourceObj ? sourceObj[videoEntry.src] : undefined).postMessage(
      {
        plusSubAction: 'addSubtitle',
        data: JSON.stringify(subtitle)
      },
      videoEntry.origin
    );
    videoEntry.hasSubtitle = true;
  }
};

interface RemoveVttFromPayload {
  videoEntry: VideoEntry;
  sourceObj?: MessageEvent['source'];
}

export const removeVttFrom = ({ videoEntry, sourceObj }: RemoveVttFromPayload): void => {
  if (videoEntry.origin === window.origin) {
    const el = document.querySelector(`video[src="${videoEntry.src}"]`);
    if (!isHTMLVideoElement(el)) {
      return;
    }
    el.classList.remove('plussub');
    Array.from(el.textTracks)
      .filter((track) => track.label === 'Plussub')
      .forEach((track) => (track.mode = 'disabled'));
    // hidden cannot work on some website(like yhdm.tv)
  } else {
    (sourceObj ? sourceObj[videoEntry.src] : undefined)?.postMessage({ plusSubAction: 'removeSubtitle' }, videoEntry.origin);
    videoEntry.hasSubtitle = false;
  }
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
      <div v-if="videoList.length">
        <div v-for="(video, index) in videoList" :key="index" style="display: grid; grid-template-columns: 1fr auto" @mouseenter="enterVideo(video)">
          <div style="grid-column: 1 / 2; align-self: center">Video {{ index + 1 }}</div>
          <a v-if="video.hasSubtitle" class="knopf flat small" style="grid-column: 2 / 3" @click="removeVttFrom(video)">Remove Sub</a>
          <a v-else class="knopf flat small" :class="{ disabled: subtitle.length === 0 || pageHasSubtitle }" style="grid-column: 2 / 3" @click="addVttTo(video)">Add Subtitle</a>
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
