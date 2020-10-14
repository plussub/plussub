import { createApp } from 'vue';
import App from './App.vue';

export const init = async (): Promise<void> => {
  if (document.getElementById('plussubShadow')) {
    const appShadowDiv = <HTMLElement>document.getElementById('plussubShadow');
    appShadowDiv.style.top = `${(window.scrollY + 30).toString()}px`;
  } else {
    const app = createApp(App);
    const appShadowDiv = document.createElement('div');
    appShadowDiv.id = 'plussubShadow';
    appShadowDiv.style.cssText = `position:absolute;z-index: 10000; top: ${window.scrollY + 30}px; right: 16px; width: 400px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); font-size: 16px`;
    const shadow = appShadowDiv.attachShadow({ mode: 'open' });

    const appDiv = document.createElement('div');
    appDiv.id = 'plussub';
    shadow.appendChild(appDiv);

    interface LinkEntry {
      href: string;
      integrity?: string;
      crossorigin?: string;
    }

    const fontAwesome: LinkEntry = {
      href: 'https://use.fontawesome.com/releases/v5.14.0/css/all.css',
      integrity: 'sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc',
      crossorigin: 'anonymous'
    };
    const roboto: LinkEntry = { href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap' };
    const rubik: LinkEntry = { href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap' };

    const prependLink = (target: HTMLElement | ShadowRoot, { href, integrity, crossorigin }: LinkEntry) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      if (integrity) {
        link.integrity = integrity;
      }
      if (crossorigin) {
        link.setAttribute('crossorigin', crossorigin);
      }
      target.prepend(link);
    };

    [roboto, rubik, fontAwesome].forEach((entry) => prependLink(document.head, entry));
    [fontAwesome].forEach((entry) => prependLink(shadow, entry));
    // [...document.querySelectorAll('head style')].filter((style) => style.innerHTML.startsWith('/* plussub header */')).forEach((style) => shadow.prepend(style));
    // Change this because when I format the code using prettier, /* plussub header */ will begin in newline
    [...document.querySelectorAll('head style')].filter((style) => style.innerHTML.match(/^\n?(\/\* plussub header \*\/)/)).forEach((style) => shadow.prepend(style));

    document.body.prepend(appShadowDiv);
    app.mount(appDiv);
  }
}