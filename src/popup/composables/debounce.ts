import { ref } from 'vue'
export const debounce = ({ fn, timeout, cb }) => {
  let isCalled = false;
  let nextFn;
  let result = ref({});
  let loading = ref(false);

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
    fn: dbFn,
    result,
    loading
  };
};
