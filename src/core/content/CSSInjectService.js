import {store} from "../redux/redux";

class CSSInjectService {
    constructor() {
        this.injectCssElementId = 'plussubInjectedCss';
        this.options = {
            nodeToInjectStyleElement: () => document.querySelector("body")
        };

        let previousLoadedCss = "";
        store.subscribe(() => {
            let css = store.getState().option.css;
            if (previousLoadedCss !== css) {
                previousLoadedCss = css;
                this.applyCssToElement(css);
            }
        });

        if (store.getState().debug.content) {
            console.log('CSSInjectService ready');
        }
    }

    applyCssToElement(css) {
        let parentNode = this.options.nodeToInjectStyleElement();
        let oldElement = parentNode.querySelector('#' + this.injectCssElementId);
        if (oldElement && oldElement.parentElement) {
            oldElement.parentElement.removeChild(oldElement);
        }

        let cssElement = document.createElement('style');
        cssElement.setAttribute('id', this.injectCssElementId);
        cssElement.innerHTML = css;
        parentNode.appendChild(cssElement);
    }
}

export default () => new CSSInjectService();
