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

setTimeout(() =>{
  if(!appShadowDiv.shadowRoot){
    return;
  }
  const toolbar = appShadowDiv.shadowRoot.querySelector('.toolbar');
  if(!toolbar){
    return;
  }

  let position = {
    x:{
      current: 0,
      last: 0
    },
    y: {
      current: 0,
      last: 0
    }
  }
  const closeDragElement = () => {
    document.removeEventListener('mouseUp', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  };

  const elementDrag = (e) => {
    e.preventDefault();
    // calculate the new cursor position:
    position = {
      x: {
        current: position.x.last -  e.clientX,
        last:  e.clientX
      },
      y: {
        current: position.y.last -  e.clientY,
        last:  e.clientY
      }
    }
    appShadowDiv.style.top = `${appShadowDiv.offsetTop - position.y.current}px`;
    appShadowDiv.style.left = `${appShadowDiv.offsetLeft - position.x.current}px`;
  }

  const dragMouseDown = e => {
    e.preventDefault();
    // get the mouse cursor position at startup:
    position.x.last = e.clientX;
    position.y.last = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
  };


  toolbar.addEventListener('mousedown', dragMouseDown);

}, 1000)
