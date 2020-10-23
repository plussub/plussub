<template></template>

<script setup="props" lang="ts">
import { init as initVideoState } from '@/iframe/video/state';

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
// useWindowMessage({
//   [AddSubtitle]: (e) =>
//     addVttToHostVideo({
//       video: { el: props.videoEl },
//       subtitle: e.data.subtitle
//     }),
//   [RemoveSubtitle]: () => removeVttFromHostVideo({ video: { el: props.videoEl } }),
//   [StartTranscript]: () => props.videoEl.addEventListener('timeupdate', sendTime),
//   [StopTranscript]: () => props.videoEl.removeEventListener('timeupdate', sendTime),
//   [SetVideoTime]: (e) => (props.videoEl.currentTime = e.data.time),
//   [GetBoundingClientRect]: sendBoundingClientRect
// });
</script>
