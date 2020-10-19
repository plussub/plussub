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
  // VideoInIFrame,
  VideoBoundingClientRect
} from '@/composables';
import { isValidVideo, initObserveAddedRemovedVideo } from '@/video/state/action/init';
import { addVttToHostVideo, removeVttFromHostVideo } from '@/video/state/action/vtt/host';
import { addSrcToVideoInIframe } from '@/video/state/action/srcToVideo/iframe';

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

if (isValidVideo({ videoIn: 'I_FRAME', el: props.videoEl, frameSrc: props.frameSrc })) {
  addSrcToVideoInIframe(props.videoEl, props.frameSrc);
} else {
  initObserveAddedRemovedVideo({ videoIn: 'I_FRAME', frameSrc: props.frameSrc });
}
</script>
