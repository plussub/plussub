<template></template>

<script setup="props" lang="ts">
import {
  AddSubtitle,
  GetBoundingClientRect,
  postWindowMessage,
  RemoveSubtitle,
  RemoveVideoInIFrame,
  SetVideoTime,
  StartTranscript,
  StopTranscript,
  useVideoElementMutationObserver,
  useWindowMessage,
  VideoBoundingClientRect,
  VideoCurrentTime,
  VideoInIFrame
} from '@/composables';
import { addVttToHostVideo, removeVttFromHostVideo } from '@/video/state/action/vtt/host';

declare const props: {
  frameSrc: string;
  videoEl: HTMLVideoElement;
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

useVideoElementMutationObserver(({ added, removed }) => {
  added.forEach((el) =>
    postWindowMessage({
      window: window.top,
      origin: '*',
      payload: {
        plusSubAction: VideoInIFrame,
        currentSrc: props.videoEl.currentSrc,
        frameSrc: props.frameSrc,
        hasSubtitle: el.classList.contains('plussub')
      }
    })
  );
  removed.forEach(() =>
    postWindowMessage({
      window: window.top,
      origin: '*',
      payload: {
        plusSubAction: RemoveVideoInIFrame,
        frameSrc: props.frameSrc,
        currentSrc: props.videoEl.currentSrc
      }
    })
  );
});

postWindowMessage({
  window: window.top,
  origin: '*',
  payload: {
    plusSubAction: VideoInIFrame,
    frameSrc: props.frameSrc,
    currentSrc: props.videoEl.currentSrc,
    hasSubtitle: props.videoEl.classList.contains('plussub')
  }
});
</script>
