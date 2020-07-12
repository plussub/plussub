import { OpenOptionPage } from '@/popup/platform/openOptionPage';

export const openOptionPage: OpenOptionPage = () => {
  chrome.tabs.create({ url: '/src/option/option.html' });
};
