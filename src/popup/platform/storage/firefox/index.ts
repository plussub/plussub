export const get = <T>(): Promise<T | null> => new Promise<T>((resolve) => chrome.storage.local.get(null, (result) => resolve(result as T)));
export const set = <T>(value: T): Promise<void> => new Promise((resolve) => chrome.storage.local.set(JSON.parse(JSON.stringify(value)), () => resolve()));
export const clear = (): Promise<void> => new Promise((resolve) => chrome.storage.local.clear(() => resolve()));
