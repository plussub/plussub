import { EXTENSION_ORIGIN } from '@/types';

export const getExtensionPopUpId = () => `${EXTENSION_ORIGIN}Shadow`;
export const getExtensionPopUpDiv = () => document.getElementById(`${EXTENSION_ORIGIN}Shadow`);

export const toExtensionPopUpInitTop = () => document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, `${window.scrollY + 30}px`);
export const extensionPopUpTopAsCssVar = () => `var(--${EXTENSION_ORIGIN}-shadow-top)`

export const toExtensionPopUpInitLeft = () => document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-left`, `0px`);
export const extensionPopUpLeftAsCssVar = () => `var(--${EXTENSION_ORIGIN}-shadow-left)`


export const moveExtensionPopUpWindow = ({top, left}) => {
  document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-top`, top)
  document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-shadow-left`, left)
}


export const toDefaultExtensionPopUpBoxShadow = () => document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-box-shadow`, '0 4px 8px 0 rgba(0, 0, 0, 0.2)');
export const toMovingExtensionPopUpBoxShadow = () => document.documentElement.style.setProperty(`--${EXTENSION_ORIGIN}-box-shadow`, "0px 12px 8px 4px rgba(0, 0, 0, 0.2)");
export const extensionPopUpBoxShadowAsCssVar = () => `var(--${EXTENSION_ORIGIN}-box-shadow)`;
