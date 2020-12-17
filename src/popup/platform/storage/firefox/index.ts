// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - null is allowed here
export const get = <T>(): Promise<T | null> => browser.storage.local.get(null) as Promise<T>;
export const set = <T>(value: T): Promise<void> => browser.storage.local.set(JSON.parse(JSON.stringify(value)));
export const clear = (): Promise<void> => browser.storage.local.clear();
