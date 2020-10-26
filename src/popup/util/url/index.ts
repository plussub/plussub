export const removeUrlHash = (url: string): string => (url ? url.split('#')[0] : '');
