export const getAll = <T>(): Promise<T | null> => new Promise<T>((resolve) => chrome.storage.sync.get(null, (result) => resolve(result as T)));
export const get = <T>(keys: string[]): Promise<any | null> => new Promise<T>((resolve) => chrome.storage.sync.get(keys, (result) => resolve(result as T)));
export const set = <T>(value: T): Promise<void> => new Promise((resolve) => chrome.storage.sync.set(JSON.parse(JSON.stringify(value)), () => resolve()));
export const clear = (): Promise<void> => new Promise((resolve) => chrome.storage.sync.clear(() => resolve()));
