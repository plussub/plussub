import { ToTranscriptPayload } from '@/navigation/state/types';

const defaultParams: ToTranscriptPayload = { contentTransitionName: 'content-navigate-deeper' as const };

export const toTranscript = (params: ToTranscriptPayload = defaultParams): void => {
  window.plusSub_navigation.value = {
    name: 'TRANSCRIPT',
    params
  };
};
