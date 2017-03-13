/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var Descriptor = require('../../../src/js/Descriptor.js').srtPlayer.Descriptor;
}


srtPlayer.LogService = srtPlayer.LogService || (()=> {
        "use strict";

        var fakeConsole = {
            log:()=>{},
            error:(t)=>console.error(t)
        };

        function getLoggerFor(serviceName){
            var SERVICE = Descriptor.SERVICE;
            switch(serviceName){
                case SERVICE.META.NAME:
                    return fakeConsole;
                case SERVICE.PARSER.NAME:
                    return fakeConsole;
                default:
                    return fakeConsole;
            }
        }

        return {
            getLoggerFor:getLoggerFor
        }
    });