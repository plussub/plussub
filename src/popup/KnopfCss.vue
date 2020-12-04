<template>

</template>
<script>
import {defineComponent} from "vue";

export default defineComponent({

});
</script>
<!--knopf.css-->
<style>
/* plussub header */
/*! knopf v1.0.9 | MIT License | https://knopf.dev/ */
:host {
  --knopf-hue: 218;
  --knopf-saturation: 77%;
  --knopf-luminosity: 37%;

  --knopf-font-size-base: 1rem;
  --knopf-font-size-small: calc(var(--knopf-font-size-base) - 0.25rem);
  --knopf-font-size-large: calc(var(--knopf-font-size-base) + 0.2rem);
  --knopf-font-size-huge: calc(var(--knopf-font-size-base) + 0.5rem);
  --knopf-padding-base: 0.375rem;
  --knopf-padding-small: calc(var(--knopf-padding-base) - 0.125rem);
  --knopf-padding-large: calc(var(--knopf-padding-base) + 0.125rem);
  --knopf-padding-huge: calc(var(--knopf-padding-base) + 0.375rem);
  --knopf-icon-size-base: 1.125rem;
  --knopf-icon-size-small: calc(var(--knopf-icon-size-base) - 0.25rem);
  --knopf-icon-size-large: calc(var(--knopf-icon-size-base) + 0.375rem);
  --knopf-icon-size-huge: calc(var(--knopf-icon-size-base) + 0.625rem);
  --knopf-font-size: var(--knopf-font-size-base);
  --knopf-padding: var(--knopf-padding-base);
  --knopf-icon-size: var(--knopf-icon-size-base);
  --knopf-border-radius: 0.33em;
  --knopf-border-style: solid;
  --knopf-border-width: 1px;
  --knopf-border-alpha: 33%;
  --knopf-font-family: inherit;
  --knopf-font-weight: 500;
  --knopf-line-height: 1.5;
  --knopf-justify-content: center;
  --knopf-text-decoration-line: none;
  --knopf-text-decoration-color: currentColor;
  --knopf-text-transform: none;
  --knopf-display: inline-flex;
  --knopf-flex-direction: row;
  --knopf-group-direction: row;
  --knopf-box-shadow: none;
  --knopf-transition: all 150ms ease-in-out;
}
/* use nesting for a local branch with no shadow dom  */
:host .knopf.knopf {
  --knopf-color: var(--knopf-hue) var(--knopf-saturation) var(--knopf-luminosity);
  --knopf-hover-color: var(--knopf-hue) var(--knopf-saturation) calc(var(--knopf-luminosity) - 10%);
  --knopf-active-color: var(--knopf-hue) var(--knopf-saturation) calc(var(--knopf-luminosity) - 15%);
  --knopf-background-color: hsl(var(--knopf-color));
  --knopf-border-color: transparent;
  --knopf-text-color: white;
  --knopf-hover-background-color: hsl(var(--knopf-hover-color));
  --knopf-hover-border-color: transparent;
  --knopf-hover-text-color: white;
  --knopf-active-background-color: hsl(var(--knopf-active-color));
  --knopf-active-border-color: transparent;
  --knopf-active-text-color: white;
  --knopf-block-padding: var(--knopf-padding);
  --knopf-inline-padding: calc(var(--knopf-padding) * 2);
  all: revert;
  align-items: center;
  background-color: var(--knopf-background-color);
  border-color: var(--knopf-border-color);
  border-radius: var(--knopf-border-radius);
  border-style: var(--knopf-border-style);
  border-width: var(--knopf-border-width);
  box-shadow: var(--knopf-box-shadow);
  box-sizing: border-box;
  color: var(--knopf-text-color);
  -webkit-text-fill-color: var(--knopf-text-color);
  cursor: pointer;
  display: var(--knopf-display);
  flex-direction: var(--knopf-flex-direction);
  font-family: var(--knopf-font-family);
  font-size: var(--knopf-font-size);
  font-weight: var(--knopf-font-weight);
  line-height: var(--knopf-line-height);
  justify-content: var(--knopf-justify-content);
  padding-block-end: var(--knopf-block-padding);
  padding-block-start: var(--knopf-block-padding);
  padding-inline-end: var(--knopf-inline-padding);
  padding-inline-start: var(--knopf-inline-padding);
  position: relative;
  text-decoration-color: var(--knopf-text-decoration-color);
  text-decoration-line: var(--knopf-text-decoration-line);
  text-transform: var(--knopf-text-transform);
  transition: var(--knopf-transition);
  white-space: nowrap;
}

:host .knopf.inverse {
  --knopf-background-color: transparent;
  --knopf-text-color: hsl(var(--knopf-color));
  --knopf-hover-background-color: hsl(var(--knopf-color));
  --knopf-hover-text-color: white;
  --knopf-active-background-color: hsl(var(--knopf-hover-color));
  --knopf-active-text-color: white;
}

:host .knopf.flat {
  --knopf-background-color: transparent;
  --knopf-text-color: hsl(var(--knopf-color));
  --knopf-hover-background-color: hsl(var(--knopf-color) / 15%);
  --knopf-hover-text-color: hsl(var(--knopf-hover-color));
  --knopf-active-background-color: hsl(var(--knopf-color) / 25%);
  --knopf-active-text-color: hsl(var(--knopf-active-color));
}

:host .knopf.pale {
  --knopf-background-color: hsl(var(--knopf-color) / 10%);
  --knopf-text-color: hsl(var(--knopf-color));
  --knopf-hover-background-color: hsl(var(--knopf-color) / 20%);
  --knopf-hover-text-color: hsl(var(--knopf-hover-color));
  --knopf-active-background-color: hsl(var(--knopf-color) / 30%);
  --knopf-active-text-color: hsl(var(--knopf-active-color));
}

:host .knopf.knopf:disabled,
:host .knopf.disabled {
  cursor: default;
  opacity: 40%;
  pointer-events: none;
}

:host .knopf.knopf:visited {
  color: var(--knopf-text-color);
}

:host .knopf.knopf:hover,
:host .knopf.knopf:active {
  --knopf-background-color: var(--knopf-hover-background-color);
  --knopf-border-color: var(--knopf-hover-border-color);
  --knopf-text-color: var(--knopf-hover-text-color);
  --knopf-text-decoration-color: var(--knopf-hover-text-decoration-color);
}

:host .knopf.knopf:focus,
:host .knopf.knopf:focus-within {
  --knopf-box-shadow: 0 0 0 0.15em hsl(var(--knopf-color) / 40%);
  outline: 0;
}

:host .knopf.active {
  --knopf-background-color: var(--knopf-active-background-color);
  --knopf-border-color: var(--knopf-active-border-color);
  --knopf-text-color: var(--knopf-active-text-color);
  --knopf-text-decoration-color: var(--knopf-active-text-decoration-color);
}

:host .knopf.small {
  --knopf-font-size: var(--knopf-font-size-small);
  --knopf-padding: var(--knopf-padding-small);
  --knopf-icon-size: var(--knopf-icon-size-small);
}

:host .knopf.large {
  --knopf-font-size: var(--knopf-font-size-large);
  --knopf-padding: var(--knopf-padding-large);
  --knopf-icon-size: var(--knopf-icon-size-large);
}

:host .knopf.huge {
  --knopf-font-size: var(--knopf-font-size-huge);
  --knopf-padding: var(--knopf-padding-huge);
  --knopf-icon-size: var(--knopf-icon-size-huge);
}

:host .knopf.traced,
:host .knopf.outlined {
  --knopf-border-color: hsl(var(--knopf-color) / var(--knopf-border-alpha));
  --knopf-hover-border-color: hsl(var(--knopf-color) / var(--knopf-border-alpha));
  --knopf-active-border-color: hsl(var(--knopf-color) / var(--knopf-border-alpha));
}

:host .knopf.outlined {
  --knopf-border-alpha: 1;
}

:host .knopf.block {
  --knopf-display: flex;
  width: 100%;
}

:host .knopf.start {
  --knopf-justify-content: flex-start;
}

:host .knopf.center {
  --knopf-justify-content: center;
}

:host .knopf.end {
  --knopf-justify-content: flex-end;
}

:host .knopf.even {
  --knopf-inline-padding: var(--knopf-padding);
}

:host .knopf.wide {
  --knopf-inline-padding: calc(var(--knopf-padding) * 3);
}

:host .knopf.pill {
  --knopf-border-radius: 9999px;
}

:host .knopf.sharp {
  --knopf-border-radius: 0;
}

:host .knopf.link {
  --knopf-border-width: 0;
  --knopf-border-radius: 0;
  --knopf-font-size: 1em;
  --knopf-padding: 0;
  --knopf-text-decoration-line: underline;
  --knopf-text-decoration-color: hsl(var(--knopf-color) / 40%);
  --knopf-hover-text-decoration-color: hsl(var(--knopf-hover-color));
  --knopf-active-text-decoration-color: hsl(var(--knopf-active-color));
  --knopf-background-color: transparent;
  --knopf-border-color: transparent;
  --knopf-text-color: hsl(var(--knopf-color));
  --knopf-hover-background-color: transparent;
  --knopf-hover-border-color: transparent;
  --knopf-hover-text-color: hsl(var(--knopf-hover-color));
  --knopf-active-background-color: transparent;
  --knopf-active-border-color: transparent;
  --knopf-active-text-color: hsl(var(--knopf-active-color));
}

:host .knopf > .icon {
  align-items: center;
  color: inherit;
  display: inline-flex;
  fill: currentColor;
  flex-shrink: 0;
  font-size: var(--knopf-icon-size);
  height: var(--knopf-icon-size);
  justify-content: center;
  width: var(--knopf-icon-size);
}

:host .knopf > .icon.small {
  --knopf-icon-size: var(--knopf-icon-size-small);
}

:host .knopf > .icon.base {
  --knopf-icon-size: var(--knopf-icon-size-base);
}

:host .knopf > .icon.large {
  --knopf-icon-size: var(--knopf-icon-size-large);
}

:host .knopf > .icon.huge {
  --knopf-icon-size: var(--knopf-icon-size-huge);
}

:host .knopf > .icon:first-child:not(:only-child) {
  margin-inline-start: calc(var(--knopf-inline-padding) * -0.25);
  margin-inline-end: calc(var(--knopf-inline-padding) * 0.5);
}

:host .knopf > .icon:last-child:not(:only-child) {
  margin-inline-start: calc(var(--knopf-inline-padding) * 0.5);
  margin-inline-end: calc(var(--knopf-inline-padding) * -0.25);
}

@media screen and (min-width: 576px) {
  .knopf > .icon.floating:not(:only-child) {
    margin-inline-start: 0;
    margin-inline-end: 0;
    position: absolute;
  }

  .knopf > .icon.floating:first-child:not(:only-child) {
    left: var(--knopf-inline-padding);
  }

  .knopf > .icon.floating:last-child:not(:only-child) {
    right: var(--knopf-inline-padding);
  }
}

:host .knopf-group {
  align-items: stretch;
  display: inline-flex;
  flex-direction: var(--knopf-group-direction);
  flex-wrap: nowrap;
  justify-content: center;
}

:host .knopf-group.vertical {
  --knopf-group-direction: column;
}

:host .knopf-group.vertical > .knopf:first-child:not(:last-child) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

:host .knopf-group.vertical > .knopf:last-child:not(:first-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

:host .knopf-group:not(.vertical) > .knopf:first-child:not(:last-child) {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

:host .knopf-group:not(.vertical) > .knopf:last-child:not(:first-child) {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

:host .knopf-group > .knopf:not(:first-child):not(:last-child) {
  --knopf-border-radius: 0;
}

:host .knopf-group.vertical > .knopf + .knopf {
  margin-block-start: calc(var(--knopf-border-width) * -1);
}

:host.knopf-group:not(.vertical) > .knopf + .knopf {
  margin-inline-start: calc(var(--knopf-border-width) * -1);
}
</style>
