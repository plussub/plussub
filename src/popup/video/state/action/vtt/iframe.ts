import { Video } from '@/video/state/types';
import { SubtitleEntry } from '@/subtitle/state/types';
import {AddSubtitle, postWindowMessage, RemoveSubtitle} from "@/composables";

export interface AddVttToIFrameVideoPayload {
  video: Pick<Video, 'origin' | 'frameSrc'>;
  subtitle: SubtitleEntry[];
  source?: MessageEvent['source'];
}

export const addVttToIFrameVideo = ({ source, video: { frameSrc }, subtitle }: AddVttToIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  postWindowMessage({
    window: source[frameSrc],
    origin,
    payload: {
      plusSubAction: AddSubtitle,
      subtitle
    }
  });
};

interface RemoveVttFromIFrameVideoPayload {
  video: Pick<Video, 'origin' | 'frameSrc'>;
  source?: MessageEvent['source'];
}

export const removeVttFromIFrameVideo = ({ video: { frameSrc, origin }, source }: RemoveVttFromIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  postWindowMessage({
    window: source[frameSrc],
    origin,
    payload: {
      plusSubAction: RemoveSubtitle
    }
  })
};
