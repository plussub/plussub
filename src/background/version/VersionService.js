/**
 * Created by sonste on 29.01.2017.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.VersionService = srtPlayer.VersionService || (() => {
        "use strict";
        return {
            getVersion:()=>srtPlayer.Version
        }
    })();