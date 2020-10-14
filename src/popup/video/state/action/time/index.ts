import {srcToIFrameSource, Video} from '@/video/state';
import {postWindowMessage, SetVideoTime, StopTranscript} from "@/composables";

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
    const iFrameSource = srcToIFrameSource[video.src];
    if(!iFrameSource){
      return;
    }
    postWindowMessage({
      window: iFrameSource.window,
      origin: iFrameSource.origin,
      payload: {
        plusSubAction: SetVideoTime,
        time
      }
    });
  }
};
