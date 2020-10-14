/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ref } from 'vue';
import {Ref} from "@vue/reactivity";

interface Payload<T> {
  resultRef: Ref;
  loadingRef: Ref;
  fn: (...args) => Promise<T>;
  timeout: number;
}

interface Result {
  fn: Payload<void>['fn'];
}

export const debounce = <T> ({ fn, timeout, resultRef, loadingRef }: Payload<T>): Result => {
  let isCalled = false;
  let nextFn;

  const dbFn = async (...args) => {
    loadingRef.value = true;
    if (isCalled) {
      nextFn = () => dbFn(...args);
      return;
    }
    isCalled = true;
    resultRef.value = await fn(...args);
    setTimeout(() => {
      isCalled = false;
      const _nextFn = nextFn;
      nextFn = null;
      if (_nextFn) {
        _nextFn();
      } else {
        loadingRef.value = false;
      }
    }, timeout);
  };

  return {
    fn: dbFn
  };
};
