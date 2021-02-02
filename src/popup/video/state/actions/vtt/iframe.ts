import { Video } from '@/video/state/types';
import { SubtitleEntry } from '@/subtitle/store';
import { AddSubtitle, postWindowMessage, RemoveSubtitle } from '@/composables';
import { srcToIFrameSource } from '@/video/state';

export interface AddVttToIFrameVideoPayload {
  video: Pick<Video, 'src'>;
  subtitles: SubtitleEntry[];
  subtitleId: string;
}

export const addVttToIFrameVideo = ({ video: { src }, subtitles, subtitleId }: AddVttToIFrameVideoPayload): void => {
  const iFrameSource = srcToIFrameSource[src];
  if (!iFrameSource) {
    return;
  }

  postWindowMessage({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    window: iFrameSource.window,
    origin: iFrameSource.origin,
    payload: {
      plusSubAction: AddSubtitle,
      src,
      // get rid of all proxies ... dont knnow a better way yet -_(*.*)_-
      subtitles: JSON.parse(JSON.stringify(subtitles)),
      subtitleId
    }
  });
};

interface RemoveVttFromIFrameVideoPayload {
  video: Pick<Video, 'src'>;
}

export const removeVttFromIFrameVideo = ({ video: { src } }: RemoveVttFromIFrameVideoPayload): void => {
  const iFrameSource = srcToIFrameSource[src];
  if (!iFrameSource) {
    return;
  }
  postWindowMessage({
    window: iFrameSource.window,
    origin: iFrameSource.origin,
    payload: {
      plusSubAction: RemoveSubtitle,
      src
    }
  });
};
