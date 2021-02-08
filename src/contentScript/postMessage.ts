export const postMessage = (payload: Record<string, unknown> & { plusSubActionFromContentScript: string }) => window.top.postMessage(payload, '*');
