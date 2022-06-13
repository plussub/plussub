export const getAll = <T>(): Promise<T | null> => chrome.storage.sync.get(null) as Promise<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T>(keys: string[]): Promise<any | null> => chrome.storage.sync.get(keys) as Promise<T>;
export const set = <T>(value: T): Promise<void> => chrome.storage.sync.set(JSON.parse(JSON.stringify(value)));
export const remove = (keys: string[]): Promise<void> => chrome.storage.sync.remove(keys);
export const clear = (): Promise<void> => chrome.storage.sync.clear();
