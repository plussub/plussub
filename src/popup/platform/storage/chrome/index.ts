export const getAll = <T>(): Promise<T | null> => new Promise<T>((resolve) => chrome.storage.sync.get(null, (result) => resolve(result as T)));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T>(keys: string[]): Promise<any | null> => new Promise<T>((resolve) => chrome.storage.sync.get(keys, (result) => resolve(result as T)));
export const set = <T>(value: T): Promise<void> => new Promise((resolve) => chrome.storage.sync.set(JSON.parse(JSON.stringify(value)), () => resolve()));
export const remove = (keys: string[]): Promise<void> => new Promise((resolve) => chrome.storage.sync.remove(keys, () => resolve()));
export const clear = (): Promise<void> => new Promise((resolve) => chrome.storage.sync.clear(() => resolve()));
