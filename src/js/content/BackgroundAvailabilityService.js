/**
 * Created by sonste on 27.02.2016.
 */


var srtPlayer = srtPlayer || {};

srtPlayer.BackgroundAvailabilityService = srtPlayer.BackgroundAvailabilityService || (() => {
        "use strict";
        var console2 = srtPlayer.LogService.getLoggerFor(srtPlayer.ServiceDescriptor.CONTENT_SERVICE.BACKGROUND_AVAILABILITY.NAME);

        var wakeUpPromise = new Promise(resolve=> {
            var wakeUpListener = (request, sender, sendResponse) => {
                if(request.command==='wakeUp'){
                    console2.log('background waked up');
                    resolve();
                }
                chrome.runtime.onMessage.removeListener(wakeUpListener);
            };
            chrome.runtime.onMessage.addListener(wakeUpListener);
            chrome.runtime.sendMessage({command:'wakeUp'});
        });

        return {
            promise:()=>wakeUpPromise
        }
    })();