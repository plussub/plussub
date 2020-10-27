<template></template>

<script setup="props" lang="ts">
import { init as initVideoState, srcToVideo } from '@/iframe/video/state';
import { close } from '@/iframe/util/close';
import {
  AddSubtitle,
  Close,
  GetBoundingClientRect,
  postWindowMessage,
  RemoveSubtitle,
  SetVideoTime,
  StartTranscript,
  StopTranscript,
  useWindowMessage,
  VideoBoundingClientRect,
  VideoCurrentTime
} from '@/composables';
import { addVttToHostVideo, removeVttFromHostVideo } from '@/video/state/actions/vtt/host';

initVideoState();

// todo refactor
let sendTimeEl;
const sendTime = () => {
  postWindowMessage({
    window: window.top,
    origin: '*',
    payload: {
      plusSubAction: VideoCurrentTime,
      currentTime: sendTimeEl.currentTime
    }
  });
};
//

useWindowMessage({
  [Close]: () => close(),
  [AddSubtitle]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    addVttToHostVideo({
      video: { el },
      subtitle: e.data.subtitle
    });
  },
  [RemoveSubtitle]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    removeVttFromHostVideo({ video: { el } });
  },
  [StartTranscript]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    sendTimeEl = el;
    el.addEventListener('timeupdate', sendTime);
  },
  [StopTranscript]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    sendTimeEl = null;
    el.removeEventListener('timeupdate', sendTime);
  },
  [SetVideoTime]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    return (el.currentTime = e.data.time);
  },
  [GetBoundingClientRect]: (e) => {
    const video = srcToVideo.value[e.data.src];
    if (!video || !video.el) {
      return;
    }
    const el = video.el as HTMLVideoElement;
    // console.warn(el.getBoundingClientRect());
    postWindowMessage({
      window: window.top,
      origin: '*',
      payload: {
        plusSubAction: VideoBoundingClientRect,
        boundingClientRect: el.getBoundingClientRect()
      }
    });
  }
});
</script>
