export const isElementNotInViewport = (el: Element) => el.getBoundingClientRect().top >= (window.innerHeight || document.documentElement.clientHeight) || el.getBoundingClientRect().bottom <= 0;
