/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from 'vue';


import App from './App.vue';
const app = createApp(App);

const appShadowDiv = document.createElement('div');
appShadowDiv.id = 'plussubShadow';
appShadowDiv.style.cssText = 'position:absolute;z-index: 10000; top: 16px; right: 16px; width: 400px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);';
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
const roboto: LinkEntry = { href: 'https://fonts.googleapis.com/css?family=Roboto' };
const rubik: LinkEntry = { href: 'https://fonts.googleapis.com/css?family=Rubik' };

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
[...document.querySelectorAll('head style')].filter((style) => style.innerHTML.startsWith('/* plussub header */')).forEach((style) => shadow.prepend(style));

document.body.prepend(appShadowDiv);
app.mount(appDiv);

setTimeout(() => dragElement(appShadowDiv), 1000)
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.shadowRoot.querySelector('.toolbar').onmousedown = dragMouseDown;
  // @ts-ignore
  // const toolbar = appShadowDiv.shadowRoot.querySelector('div > .toolbar');
  // @ts-ignore
  // toolbar.onmousedown = dragMouseDown

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
