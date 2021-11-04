(function() {
  if (document.querySelector('#plussub-cue-style')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'plussub-cue-style';

  style.innerHTML = `
  video[data-plus-sub-status="injected"]::cue{
    color: var(--plusSub-cue-color);
    background-color: var(--plusSub-cue-background-color);
    font-size: calc(var(--plusSub-cue-font-size)*1px);
    font-weight: var(--plusSub-cue-font-weight);
    line-height: var(--plusSub-cue-line-height);

    background-color: var(--plusSub-cue-background-color);
    background-image: linear-gradient(var(--plusSub-cue-background-color), var(--plusSub-cue-background-color));
    border-color: var(--plusSub-cue-background-color);
    text-decoration-color: var(--plusSub-cue-background-color);
  }
`;
    document.head.append(style);
})();

