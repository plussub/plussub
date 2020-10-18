<template></template>

<script setup="props" lang="ts">
import {
  AddSubtitle,
  GetBoundingClientRect,
  postWindowMessage,
  RemoveSubtitle,
  SetVideoTime,
  StartTranscript,
  StopTranscript,
  useWindowMessage,
  VideoCurrentTime,
  VideoInIFrame,
  VideoBoundingClientRect
} from '@/composables';
import { addVttToHostVideo, removeVttFromHostVideo } from '@/video/state/action/vtt/host';

declare const props: {
  frameSrc: string;
  videoEl: HTMLVideoElement;
  // test: string;
};

const sendTime = () => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: VideoCurrentTime,
      currentTime: props.videoEl.currentTime
    }
  });
};

const sendBoundingClientRect = () => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: VideoBoundingClientRect,
      boundingClientRect: props.videoEl.getBoundingClientRect()
    }
  });
};

useWindowMessage({
  [AddSubtitle]: (e) =>
    addVttToHostVideo({
      video: { el: props.videoEl },
      subtitle: e.data.subtitle
    }),
  [RemoveSubtitle]: () => removeVttFromHostVideo({ video: { el: props.videoEl } }),
  [StartTranscript]: () => props.videoEl.addEventListener('timeupdate', sendTime),
  [StopTranscript]: () => props.videoEl.removeEventListener('timeupdate', sendTime),
  [SetVideoTime]: (e) => (props.videoEl.currentTime = e.data.time),
  [GetBoundingClientRect]: sendBoundingClientRect
});

// the src here means frameSrc
// Not use videoEl.src as object key as some video element don't have src and maybe duplicate
// eg. https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs
// may change this if have any bugs
postWindowMessage({
  window: window.top,
  origin: '*',
  payload: {
    plusSubAction: VideoInIFrame,
    // frameSrc: props.frameSrc,
    // src: props.videoEl.src,
    // todo: still use framesrc as property name to clarify the meaning
    src: props.frameSrc,
    hasSubtitle: props.videoEl.classList.contains('plussub')
  }
});
</script>
