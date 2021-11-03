// i don't know it is a good idea... but apollo has this dependency:
// symbol-observable and it breaks everything on firefox.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function
window.Symbol.for = () => {};
