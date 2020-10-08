import { SrtEntry } from '@/appState';

export interface AddVttToIFrameVideoPayload {
  video: {
    origin: string;
    src: string;
  };
  source?: MessageEvent['source'];
  subtitle: SrtEntry[];
}

export const addVttToIFrameVideo = ({ source, video: { src }, subtitle }: AddVttToIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  source[src].postMessage({ plusSubAction: 'addSubtitle', data: JSON.stringify(subtitle) }, origin);
};

interface RemoveVttFromIFrameVideoPayload {
  video: {
    origin: string;
    src: string;
  };
  source?: MessageEvent['source'];
}

export const removeVttFromIFrameVideo = ({ video: { src, origin }, source }: RemoveVttFromIFrameVideoPayload): void => {
  if (!source) {
    return;
  }
  source[src].postMessage({ plusSubAction: 'removeSubtitle' }, origin);
};
