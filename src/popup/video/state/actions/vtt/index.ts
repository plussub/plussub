import {Video} from "@/video/state/types";

import {addVttToHostVideo, removeVttFromHostVideo} from './host';
import {addVttToIFrameVideo, removeVttFromIFrameVideo} from './iframe';
import {SubtitleEntry} from "@/subtitle/state/types";

interface AddVttToPayload {
  video: Video;
  subtitles: SubtitleEntry[];
  subtitleId: string;
}

export const addVttTo = ({ video, subtitles, subtitleId }: AddVttToPayload): void => {
  if (video.in === 'HOST') {
    addVttToHostVideo({ video, subtitles, subtitleId });
  } else {
    addVttToIFrameVideo({video, subtitles, subtitleId });
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
