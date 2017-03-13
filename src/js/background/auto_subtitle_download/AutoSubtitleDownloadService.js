/**
 * Created by sbreitenstein on 16/01/17.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.AutoSubtitleDownloadService = srtPlayer.AutoSubtitleDownloadService || ((messageBusLocal = messageBus)=> {

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        var META_WRITE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META_WRITE);

        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.PUB.DOWNLOAD_RESULT,
            callback: (srt)=> {
                "use strict";
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.PARSER.SUB.PARSE,
                    data: {
                        type: 'srt',
                        raw: srt
                    }
                });
            }
        });

        META_WRITE_CHANNEL.subscribe({
            topic:'selected_subtitle.entry',
            callback:(selectedSubtitle)=>{
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.DOWNLOAD,
                    data: selectedSubtitle.downloadLink
                });
            }
        });

});


//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.AutoSubtitleDownloadService === 'function') {
    srtPlayer.AutoSubtitleDownloadService = srtPlayer.AutoSubtitleDownloadService();
}
