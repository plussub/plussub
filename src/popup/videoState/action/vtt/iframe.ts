import { SrtEntry } from '@/appState';
import {Video} from "@/videoState/types";

export interface AddVttToIFrameVideoPayload {
  video: Pick<Video, 'origin' | 'src'>;
  subtitle: SrtEntry[];
  source?: MessageEvent['source'];
}

export const addVttToIFrameVideo = ({ source, video: { src }, subtitle }: AddVttToIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  source[src].postMessage({ plusSubAction: 'addSubtitle', data: JSON.stringify(subtitle) }, origin);
};

interface RemoveVttFromIFrameVideoPayload {
  video: Pick<Video, 'origin' | 'src'>;
  source?: MessageEvent['source'];
}

export const removeVttFromIFrameVideo = ({ video: { src, origin }, source }: RemoveVttFromIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  source[src].postMessage({ plusSubAction: 'removeSubtitle' }, origin);
};
