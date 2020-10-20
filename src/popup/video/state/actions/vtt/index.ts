import {Video} from "@/video/state/types";

import {addVttToHostVideo, removeVttFromHostVideo} from './host';
import {addVttToIFrameVideo, removeVttFromIFrameVideo} from './iframe';
import {SubtitleEntry} from "@/subtitle/state/types";

interface AddVttToPayload {
  video: Video;
  subtitle: SubtitleEntry[];
}

export const addVttTo = ({ video, subtitle }: AddVttToPayload): void => {
  if (video.in === 'HOST') {
    addVttToHostVideo({ video, subtitle });
  } else {
    addVttToIFrameVideo({video, subtitle });
  }
  video.hasSubtitle = true;
};

interface RemoveVttFromPayload {
  video: Video;
}

export const removeVttFrom = ({ video}: RemoveVttFromPayload): void => {
  if (video.in === 'HOST') {
    removeVttFromHostVideo({ video });
  } else {
    removeVttFromIFrameVideo({ video });
  }
  video.hasSubtitle = false;
};
