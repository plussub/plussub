/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.Redux = require('../../redux/redux').srtPlayer.Redux;
    srtPlayer.ActionCreators = require('../../redux/actionCreators').srtPlayer.ActionCreators;        
}


srtPlayer.ParserService = srtPlayer.ParserService || (() => {

        let unsubscribe = srtPlayer.Redux.subscribe(() => {
            let subtitleState = srtPlayer.Redux.getState().subtitle;
            if (subtitleState.raw.length > 0 && subtitleState.parsed.length === 0) {
                try {
                    parse(subtitleState.raw, subtitleState.offsetTime);
                }catch(e){
                    return srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parsedSubtitle( {
                       message:`Parsing failed: ${e}`,
                       src:"parserService"
                   },true));
                }
            }

            if (!subtitleState.offsetTimeApplied) {
                applyOffset(subtitleState.pastOffsetTime, subtitleState.offsetTime, subtitleState.parsed);
            }

        });

        function applyOffset(pastOffsetTime, offsetTime, toSubtitle) {
            let subtitleWithOffset = toSubtitle.map(e => {
                return {...e, from: e.from - pastOffsetTime + offsetTime, to: e.to - pastOffsetTime + offsetTime};
            });
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parsedSubtitle(subtitleWithOffset));
        }

        function parse(raw, offsetTime) {
            let parsedSubtitle = srtPlayer.SRTParser().parse(raw).map((e) => {
                return {...e, from: e.from + offsetTime, to: e.to + offsetTime};
            });
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parsedSubtitle(parsedSubtitle));
        }

        return {
            shutdown:unsubscribe
        };
    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.ParserService === 'function') {
    srtPlayer.ParserService = srtPlayer.ParserService();
}