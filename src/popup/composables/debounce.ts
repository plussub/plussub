export const debounce = ({ fn, timeout, cb }) => {
  let isCalled = false;
  let nextFn;
  const dbFn = async (...args) => {
    if (isCalled) {
      nextFn = () => dbFn(...args);
      return;
    }
    isCalled = true;
    cb(await fn(...args));
    setTimeout(() => {
      isCalled = false;
      const _nextFn = nextFn;
      nextFn = null;
      if (_nextFn) {
        _nextFn();
      }
    }, timeout);
  };

  return dbFn;
};
