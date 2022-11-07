(function() {
  const EXTENSION_ORIGIN = "plussub";
  if (document.querySelector(`#${EXTENSION_ORIGIN}-cue-style`)) {
    return;
  }

  const style = document.createElement('style');
  style.id = `${EXTENSION_ORIGIN}-cue-style`;

  style.innerHTML = `
  video[data-${EXTENSION_ORIGIN}-status="injected"]::cue{
    color: var(--${EXTENSION_ORIGIN}-cue-color);
    background-color: var(--${EXTENSION_ORIGIN}-cue-background-color);
    font-size: calc(var(--${EXTENSION_ORIGIN}-cue-font-size)*1px);
    font-weight: var(--${EXTENSION_ORIGIN}-cue-font-weight);
    line-height: var(--${EXTENSION_ORIGIN}-cue-line-height);

    background-color: var(--${EXTENSION_ORIGIN}-cue-background-color);
    background-image: linear-gradient(var(--${EXTENSION_ORIGIN}-cue-background-color), var(--${EXTENSION_ORIGIN}-cue-background-color));
    border-color: var(--${EXTENSION_ORIGIN}-cue-background-color);
    text-decoration-color: var(--${EXTENSION_ORIGIN}-cue-background-color);
  }
`;
    document.head.append(style);
})();

