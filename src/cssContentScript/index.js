(function() {
  if (document.querySelector('#plussub-cue-style')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'plussub-cue-style';

  style.innerHTML = `
  video[data-plussub-status="injected"]::cue{
    color: var(--plussub-cue-color);
    background-color: var(--plussub-cue-background-color);
    font-size: calc(var(--plussub-cue-font-size)*1px);
    font-weight: var(--plussub-cue-font-weight);
    line-height: var(--plussub-cue-line-height);

    background-color: var(--plussub-cue-background-color);
    background-image: linear-gradient(var(--plussub-cue-background-color), var(--plussub-cue-background-color));
    border-color: var(--plussub-cue-background-color);
    text-decoration-color: var(--plussub-cue-background-color);
  }
`;
    document.head.append(style);
})();

