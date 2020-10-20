(async function () {
  if (window.self !== window.top) {
    return (await import('./inIFrame')).init();
  } else {
    return (await import('./inHost')).init();
  }
})();
