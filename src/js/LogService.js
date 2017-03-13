/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('./Descriptor.js').srtPlayer.Descriptor;

}


srtPlayer.LogService = srtPlayer.LogService || (()=> {
        "use strict";

        var fakeConsole = {
            log:()=>{},
            error:(t)=>console.error(t)
        };

        function getLoggerFor(serviceName){
            var BACKEND_SERVICE = srtPlayer.Descriptor.SERVICE;
            var CONTENT_SERVICE = srtPlayer.Descriptor.CONTENT_SERVICE;
            var GENERAL_SERVICE = srtPlayer.Descriptor.GENERAL_SERVICE;

            switch(serviceName){
                case BACKEND_SERVICE.META.NAME:
                    return fakeConsole;
                case BACKEND_SERVICE.PARSER.NAME:
                    return fakeConsole;
                case GENERAL_SERVICE.CHANNEL_LOG_SERVICE.NAME:
                    return console;
                default:
                    return fakeConsole;
            }
        }

        return {
            getLoggerFor:getLoggerFor
        }
    });


//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.LogService === 'function') {
    srtPlayer.LogService = srtPlayer.LogService();
}