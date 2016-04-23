/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messagingConst = require('../srtchrome/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
}


srtPlayer.LogServiceForTest = srtPlayer.LogServiceForTest || (()=> {
        "use strict";

        var fakeConsole = {
            log:()=>{},
            error:(t)=>console.error(t)
        };

        function getLoggerFor(serviceName){
            var SERVICE = messagingConst.BACKEND_SERVICE;
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