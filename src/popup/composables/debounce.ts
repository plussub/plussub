/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ref } from 'vue';
import {Ref} from "@vue/reactivity";

interface Payload<T> {
  fn: (...args) => T;
  timeout: number;
}

interface Result<T> {
  fn: Payload<T>['fn'];
  result: Ref<Record<string, unknown>>;
  loading: Ref<boolean>;
}

export const debounce = <T> ({ fn, timeout }: Payload<T>): Result<T> => {
  let isCalled = false;
  let nextFn;
  const result = ref({});
  const loading = ref(false);

  const dbFn = async (...args) => {
    loading.value = true;
    if (isCalled) {
      nextFn = () => dbFn(...args);
      return;
    }
    isCalled = true;
    result.value = await fn(...args);
    setTimeout(() => {
      isCalled = false;
      const _nextFn = nextFn;
      nextFn = null;
      if (_nextFn) {
        _nextFn();
      } else {
        loading.value = false;
      }
    }, timeout);
  };

  return {
    // @ts-ignore
    fn: dbFn,
    result,
    loading
  };
};
