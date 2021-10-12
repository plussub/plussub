export const postMessage = (payload: Record<string, unknown> & { plusSubContentScriptOutput: string }) => {
  // console.warn(payload.plusSubActionFromContentScript);
  window.top?.postMessage({...payload, id: window.contentScript.id}, '*');
};
