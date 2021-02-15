export const postMessage = (payload: Record<string, unknown> & { plusSubActionFromContentScript: string }) => {
  console.warn(payload.plusSubActionFromContentScript);
  window.top.postMessage(payload, '*');
};
