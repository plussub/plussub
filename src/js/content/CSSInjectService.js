/**
 * Created by sonste on 15.03.2016.
 */
srtPlayer.CSSInjectService = srtPlayer.CSSInjectService || (() => {
        "use strict";
        const SERVICE_CHANNEL = messageBus.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        const META_CHANNEL = messageBus.channel(srtPlayer.Descriptor.CHANNEL.META);
        const injectCssId = 'plussubInjectedCss';

        META_CHANNEL.subscribe({
            topic: "option.css",
            callback: (css)=> {

                let oldElement = document.querySelector('#'+injectCssId);
                if(oldElement){
                    oldElement.parentElement.removeChild(oldElement);
                }

                let cssElement = document.createElement('style');
                cssElement.setAttribute('id',injectCssId);
                cssElement.innerHTML = css;
                document.querySelector('body').appendChild(cssElement);
            }
        });

        SERVICE_CHANNEL.publish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
            data: 'option.css'
        });
    })();