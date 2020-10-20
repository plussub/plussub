import { navigationState } from '@/navigation/state/state';
import { ToTranscriptPayload } from '@/navigation/state/types';

const defaultParams: ToTranscriptPayload = { contentTransitionName: 'content-navigate-deeper' as const };

export const toTranscript = (params: ToTranscriptPayload = defaultParams): void => {
  navigationState.value = {
    name: 'TRANSCRIPT',
    params
  };
};
