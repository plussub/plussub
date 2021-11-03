/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - null is allowed here
export const getAll = <T>(): Promise<T | null> => {
  return (async () => null)()
  // return browser.storage.sync.get(null) as Promise;
};
export const get = <T>(keys: string[]): Promise<T | null> => {
  return (async () => null)();
};
export const set = <T>(value: T): Promise<void> => {
  return (async () => {

  })()
  // return browser.storage.sync.set(JSON.parse(JSON.stringify(value)));
};
export const clear = (): Promise<void> => {
  return (async () => {

  })()
  // return browser.storage.sync.clear();
};
