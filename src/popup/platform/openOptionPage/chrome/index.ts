import { OpenOptionPage } from '@/platform/openOptionPage';

export const openOptionPage: OpenOptionPage = () => {
  chrome.tabs.create({ url: '/src/option/option.html' });
};
