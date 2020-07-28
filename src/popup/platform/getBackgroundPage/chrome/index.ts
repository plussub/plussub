import {GetBackgroundPageResult} from '@/platform/getBackgroundPage/types';

export const getBackgroundPage = (): Promise<GetBackgroundPageResult> => {
  return new Promise((resolve) => chrome.runtime.getBackgroundPage((backgroundPage) => resolve(backgroundPage as GetBackgroundPageResult)));
};
