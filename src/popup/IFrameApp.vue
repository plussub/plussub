<template>

</template>

<script setup="props" lang="ts">
import {AddSubtitle, postWindowMessage, useWindowMessage, VideoInIFrame} from "@/composables";

declare const props: {
  frameSrc: string;
  videoEl: HTMLVideoElement;
  test: string;
};

useWindowMessage({
  [AddSubtitle]: (e) => {
    console.warn(e);
  }
})

postWindowMessage({
  window: window.top,
  origin: '*',
  payload: {
    plusSubAction: VideoInIFrame,
    frameSrc: props.frameSrc,
    src: props.videoEl.src,
    hasSubtitle: props.videoEl.classList.contains('plussub')
  }
});

</script>
