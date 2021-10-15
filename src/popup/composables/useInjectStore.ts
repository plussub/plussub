import { inject } from 'vue';
import {StoreKey, Store} from 'storeTypes';

export const useInjectStore = <T extends StoreKey>(storeKey: T): Store<T> => {
  const store = inject<Store<T>>(storeKey);
  if (!store) {
    throw new Error(`inject failed: ${storeKey}`);
  }
  return store;
};
