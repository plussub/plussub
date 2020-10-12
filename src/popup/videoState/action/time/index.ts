import { Video } from '@/videoState';
import { SrtEntry } from '@/appState';

interface Payload {
  video: Video;
  time: number;
}

export const setCurrentTime = ({ video, time }: Payload): void => {
  if (video.in === 'HOST') {
    if (video.el) {
      video.el.currentTime = time;
    }
  } else {
    // props.sourceObj[videoInFrameHasSub.value.src].postMessage(
    //   {
    //     plusSubAction: 'setCurrentTime',
    //     data
    //   },
    //   videoInFrameHasSub.value.origin
    // );
  }
};
