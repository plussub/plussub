import { EXTENSION_ORIGIN } from './types';

export const postMessage = (payload: Record<string, unknown> & { contentScriptOutput: string}) => {
  window.top?.postMessage({...payload, id: window.contentScript.id, extensionOrigin: EXTENSION_ORIGIN}, '*');
};
