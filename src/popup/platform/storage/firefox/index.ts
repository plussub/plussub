// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - null is allowed here
export const getAll = <T>(): Promise<T | null> => browser.storage.sync.get(null) as Promise<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T>(keys: string[]): Promise<any | null> => browser.storage.sync.get(keys) as Promise<T>;
export const set = <T>(value: T): Promise<void> => browser.storage.sync.set(JSON.parse(JSON.stringify(value)));
export const remove = (keys: string[]): Promise<void> => browser.storage.sync.remove(keys);
export const clear = (): Promise<void> => browser.storage.sync.clear();
