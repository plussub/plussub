(() => {
  return {
    videos: [...document.querySelectorAll('video')].map((el) => ({
      src: el.src,
      hasSubtitle: el.classList.contains('plussub')
    }))
  };
})();
