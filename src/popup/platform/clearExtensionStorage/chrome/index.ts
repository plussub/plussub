export const clearExtensionStorage = (): Promise<void> => new Promise((resolve) => chrome.storage.local.clear(() => resolve()));
