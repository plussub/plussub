(async function () {
  const inIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };
  if (inIframe()) {
    return (await import('./inIFrame')).init();
  } else {
    return (await import('./inHost')).init();
  }
})();
