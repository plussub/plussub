<template></template>

<script setup="props" lang="ts">
import { init as initVideoState, srcToVideo } from '@/iframe/video/state';
import { close } from '@/iframe/util/close';
import { AddSubtitle, Close, useWindowMessage } from '@/composables';
import { addVttToHostVideo } from '@/video/state/actions/vtt/host';

initVideoState();

// import {
//   AddSubtitle,
//   GetBoundingClientRect,
//   postWindowMessage,
//   RemoveSubtitle,
//   RemoveVideoInIFrame,
//   SetVideoTime,
//   StartTranscript,
//   StopTranscript,
//   useVideoElementMutationObserver,
//   useWindowMessage,
//   VideoBoundingClientRect,
//   VideoCurrentTime,
//   VideoInIFrame
// } from '@/composables';
// import { addVttToHostVideo, removeVttFromHostVideo } from '@/video/state/actions/vtt/host';
//
// const sendTime = () => {
//   postWindowMessage({
//     window: window.top,
//     origin: '*',
//     payload: {
//       plusSubAction: VideoCurrentTime,
//       currentTime: props.videoEl.currentTime
//     }
//   });
// };
//
// const sendBoundingClientRect = () => {
//   postWindowMessage({
//     window: window.top,
//     origin: '*',
//     payload: {
//       plusSubAction: VideoBoundingClientRect,
//       boundingClientRect: props.videoEl.getBoundingClientRect()
//     }
//   });
// };
//
useWindowMessage({
  [Close]: () => close(),
  [AddSubtitle]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if(!video || !video.el){
      return;
    }
    const el = video.el as HTMLVideoElement;
    addVttToHostVideo({
      video: { el },
      subtitle: e.data.subtitle
    });
  }
  // [RemoveSubtitle]: () => removeVttFromHostVideo({ video: { el: props.videoEl } }),
  // [StartTranscript]: () => props.videoEl.addEventListener('timeupdate', sendTime),
  // [StopTranscript]: () => props.videoEl.removeEventListener('timeupdate', sendTime),
  // [SetVideoTime]: (e) => (props.videoEl.currentTime = e.data.time),
  // [GetBoundingClientRect]: sendBoundingClientRect
});
</script>
